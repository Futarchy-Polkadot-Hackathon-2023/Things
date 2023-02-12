"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archive_registry_1 = require("@subsquid/archive-registry");
const substrate_processor_1 = require("@subsquid/substrate-processor");
const typeorm_store_1 = require("@subsquid/typeorm-store");
const typeorm_1 = require("typeorm");
const model_1 = require("./model");
const processor = new substrate_processor_1.SubstrateBatchProcessor()
    .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    //archive: lookupArchive("kusama", {release: "FireSquid"})
    // Use archive created by archive/docker-compose.yml
    archive: (0, archive_registry_1.lookupArchive)('kusama', { release: 'FireSquid' })
})
    // .setBlockRange({ from: 6998400 }) // bountyBecameActive
    // .setBlockRange({ from: 6924780, to: 7042000 }) // plenty different type of events in short space
    // .setBlockRange({ from: 6924780 }) // plenty different type of events in short space
    // .setBlockRange({ from: 6981761 }) // bountyAwarded
    // .setBlockRange({ from: 6998400 }) // bountyBecameActive
    // .setBlockRange({ from: 15526366 }) // BountyExtended
    // .setBlockRange({ from: 15820891 }) // bountyClaimed
    // .setBlockRange({ from: 10330533 }) // BountyRejected
    // .setBlockRange({ from: 11847382 }) // BountyCanceled
    // .setBlockRange({ from: 7691636 }) // BountyExtended
    .setBlockRange({ from: 10208170 }) // bountyClaimed
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    // .setBlockRange({ from: 6219002 }) // bountyAwarded
    .addEvent('Bounties.BountyProposed', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            call: {
                args: true,
                error: true
            }
        }
    }
})
    .addEvent('Bounties.BountyRejected', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            call: {
                args: true,
                error: true
            }
        }
    }
})
    .addEvent('Bounties.BountyAwarded', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            call: {
                args: true,
                error: true
            }
        }
    }
})
    .addEvent('Bounties.BountyBecameActive', {
    data: {
        event: {
            args: true
        }
    }
})
    .addEvent('Bounties.BountyClaimed', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            call: {
                args: true,
                error: true
            }
        }
    }
})
    .addEvent('Bounties.BountyExtended', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            call: {
                args: true,
                error: true
            }
        }
    }
})
    .addEvent('Bounties.BountyCanceled', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            call: {
                args: true,
                error: true
            }
        }
    }
});
processor.run(new typeorm_store_1.TypeormDatabase(), async (ctx) => {
    let bountiesData = getBounties(ctx);
    let accountIds = new Set();
    let accounts = await ctx.store.findBy(model_1.Account, { id: (0, typeorm_1.In)([...accountIds]) }).then(accounts => {
        return new Map(accounts.map(a => [a.id, a]));
    });
    let bountiesToStore = [];
    for (let b of bountiesData) {
        let { id, blockNumber, timestamp, bountyName, bountyIndex, extrinsicHash, extrinsicSuccess, // extrinsicError?,  
        extrinsicId, callArgsIndex, eventArgsIndex, proposalHash, // proposalIndex, // approve, // proposer?: 
        fee } = b;
        // let proposer = getAccount(accounts, b.proposer)
        bountiesToStore.push(new model_1.Bounty({
            id,
            blockNumber,
            timestamp,
            bountyName,
            bountyIndex,
            extrinsicId,
            // proposalIndex, 
            proposalHash,
            // approve,
            // proposer?: 
            fee
        }));
    }
    await ctx.store.save(Array.from(accounts.values()));
    await ctx.store.insert(bountiesToStore);
});
// NB These loops will run for every call and event, not just Bounty -related ones.
// and they will run once for the event, then once for the call.
function getBounties(ctx) {
    let blockBountiesLength = 0;
    let bounties = [];
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            switch (item.name) {
                case "Bounties.BountyProposed": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args.index ||
                            item.event.args,
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Bounties.BountyRejected": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args.index
                            || item.event.args[0],
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Bounties.BountyAwarded": {
                    console.log('item=', item);
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        // bountyIndex: item.event.args[0],
                        bountyIndex: 
                        // @ts-ignore
                        item.event.call.args.bountyId
                            || searchItemlikeObjectFor(item.event.call, 'bountyId'),
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Bounties.BountyBecameActive": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args.index ||
                            item.event.args,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                    });
                    break;
                }
                case "Bounties.BountyClaimed": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        // bountyIndex: item.event.args.index || item.event.args[0],   // :/
                        // @ts-ignore
                        bountyIndex: item.event.args.index || // eg 15820891   (also event.call.args.bountyId)
                            item.event.args[0],
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Bounties.BountyExtended": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: searchItemlikeObjectFor(item.event.call, 'bountyId')
                            || item.event.args.index // (eg 15526366)
                            || item.event.args,
                        // bountyIndex: item.event.call.args.bountyIndex,     // (eg 14534356 some earlier like this, some not)
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Bounties.BountyCanceled": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args.index,
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                default: {
                    if (item.name.startsWith('Bounties')) {
                        console.log(`Default case reached (due to no break or no match) \nAlready pushed bounty event *or call* at ${block.header.height}`);
                        console.log('item=', item);
                        // @ts-ignore
                        if (item.event) {
                            // @ts-ignore
                            console.log(`Already pushed bounty event ${item.event.name || '... BUT NO item.event.name\n' + item.event.name.toString()} \n`);
                        }
                    }
                }
            }
            // if (blockBountiesLength!==bounties.length) {
            //     console.log(`Last known length was ${blockBountiesLength}. New item (${bounties.length-1}) added to bounties= `, bounties[bounties.length-1])
            //     console.log('\n')
            //     blockBountiesLength = bounties.length               
            // }
        }
    }
    return bounties;
}
function getAccount(m, id) {
    let acc = m.get(id);
    if (acc == null) {
        acc = new model_1.Account();
        acc.id = id;
        m.set(id, acc);
    }
    return acc;
}
// uurgh
function searchItemlikeObjectFor(obj, key) {
    if (obj[key] !== undefined)
        return obj[key];
    if (obj.args !== undefined && obj.args[key] !== undefined)
        return obj.args[key];
    if (obj.value !== undefined && obj.value[key] !== undefined)
        return obj.value[key];
    if (obj.args !== undefined && obj.args.call !== undefined) {
        const iShallRecurThisOnlyOnce = obj.args.call;
        if (iShallRecurThisOnlyOnce.value !== undefined && iShallRecurThisOnlyOnce.value[key] !== undefined)
            return iShallRecurThisOnlyOnce.value[key];
        if (iShallRecurThisOnlyOnce.value !== undefined && iShallRecurThisOnlyOnce.value.call !== undefined && iShallRecurThisOnlyOnce.value.call.value !== undefined && iShallRecurThisOnlyOnce.value.call.value[key] !== undefined)
            return iShallRecurThisOnlyOnce.value.call.value[key];
    }
}
//# sourceMappingURL=processor.js.map