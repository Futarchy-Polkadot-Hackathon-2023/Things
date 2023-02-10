"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const archive_registry_1 = require("@subsquid/archive-registry");
const ss58 = __importStar(require("@subsquid/ss58"));
const substrate_processor_1 = require("@subsquid/substrate-processor");
const typeorm_store_1 = require("@subsquid/typeorm-store");
const typeorm_1 = require("typeorm");
const model_1 = require("./model");
const events_1 = require("./types/events");
const processor = new substrate_processor_1.SubstrateBatchProcessor()
    .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    //archive: lookupArchive("kusama", {release: "FireSquid"})
    // Use archive created by archive/docker-compose.yml
    archive: (0, archive_registry_1.lookupArchive)('kusama', { release: 'FireSquid' })
})
    // .setBlockRange({ from: 6998400 }) // bountyBecameActive
    // .setBlockRange({ from: 6924780, to: 7042000 }) // plenty different type of events in short space
    .setBlockRange({ from: 6924780 }) // plenty different type of events in short space
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
})
    .addEvent('Balances.Transfer', {
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
    let transfersData = getTransfers(ctx);
    let bountiesData = getBounties(ctx);
    let accountIds = new Set();
    for (let t of transfersData) {
        accountIds.add(t.from);
        accountIds.add(t.to);
    }
    let accounts = await ctx.store.findBy(model_1.Account, { id: (0, typeorm_1.In)([...accountIds]) }).then(accounts => {
        return new Map(accounts.map(a => [a.id, a]));
    });
    let transfersToStore = [];
    let bountiesToStore = [];
    for (let t of transfersData) {
        let { id, blockNumber, timestamp, extrinsicHash, amount, fee } = t;
        let from = getAccount(accounts, t.from);
        let to = getAccount(accounts, t.to);
        transfersToStore.push(new model_1.Transfer({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            from,
            to,
            amount,
            fee
        }));
    }
    for (let b of bountiesData) {
        let { id, blockNumber, timestamp, bountyName, extrinsicHash, extrinsicSuccess, // extrinsicError?,  
        extrinsicId, callArgsIndex, eventArgsIndex, proposalHash, // proposalIndex, // approve, // proposer?: 
        fee } = b;
        // let proposer = getAccount(accounts, b.proposer)
        bountiesToStore.push(new model_1.Bounty({
            id,
            blockNumber,
            timestamp,
            bountyName,
            extrinsicHash,
            extrinsicSuccess,
            // extrinsicError?, 
            extrinsicId,
            callArgsIndex,
            eventArgsIndex,
            // proposalIndex, 
            proposalHash,
            // approve,
            // proposer?: 
            fee
        }));
    }
    await ctx.store.save(Array.from(accounts.values()));
    await ctx.store.insert(transfersToStore);
    await ctx.store.insert(bountiesToStore);
});
function getTransfers(ctx) {
    let transfers = [];
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == "Balances.Transfer") {
                let e = new events_1.BalancesTransferEvent(ctx, item.event);
                let rec;
                if (e.isV1020) {
                    let [from, to, amount] = e.asV1020;
                    rec = { from, to, amount };
                }
                else if (e.isV1050) {
                    let [from, to, amount] = e.asV1050;
                    rec = { from, to, amount };
                }
                else if (e.isV9130) {
                    rec = e.asV9130;
                }
                else {
                    throw new Error('Unsupported spec');
                }
                transfers.push({
                    id: item.event.id,
                    blockNumber: block.header.height,
                    timestamp: new Date(block.header.timestamp),
                    extrinsicHash: item.event.extrinsic?.hash,
                    from: ss58.codec('kusama').encode(rec.from),
                    to: ss58.codec('kusama').encode(rec.to),
                    amount: rec.amount,
                    fee: item.event.extrinsic?.fee || 0n
                });
            }
        }
    }
    return transfers;
}
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
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgsIndex: item.event.args.index,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
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
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgsIndex: item.event.args.index,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Bounties.BountyAwarded": {
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgsIndex: item.event.args.index,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
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
                        eventArgsIndex: item.event.args.index,
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
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgsIndex: item.event.args.index,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
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
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgsIndex: item.event.args.index,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
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
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgsIndex: item.event.args.index,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
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
//# sourceMappingURL=processor.js.map