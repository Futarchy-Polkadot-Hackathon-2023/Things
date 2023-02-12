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
    .setBlockRange({ from: 15426015 }) // Referendum executed: #244 Runtime v9320 Upgrade On Kusama Network
    // .setBlockRange({ from: 6998400 }) 
    .addEvent('Treasury.Proposed', {
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
    .addEvent('Treasury.Awarded', {
    data: {
        event: {
            args: true
        }
    }
})
    .addEvent('Treasury.SpendApproved', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            },
            // // Why is .call null in SpendApproved?
            // call: {
            //     args: true,
            //     error: true
            // }
        }
    }
})
    .addEvent('Treasury.Spending', {
    data: {
        event: {
            args: true
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
        let { id, blockNumber, timestamp, proposalName, proposalIndex, extrinsicId, beneficiary, // approve, // proposer?: 
        fee } = b;
        // let proposer = getAccount(accounts, b.proposer)
        bountiesToStore.push(new model_1.Proposal({
            id,
            blockNumber,
            timestamp,
            proposalName,
            proposalIndex,
            extrinsicId,
            // approve,
            beneficiary,
            // proposer
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
                case "Treasury.Proposed": {
                    bounties.push({
                        id: item.event.id,
                        proposalName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        amount: item.event.call?.args.value,
                        extrinsicId: item.event.extrinsic?.id,
                        proposalIndex: item.event.args.proposalIndex,
                        // TODO: locate item.event.call.args.approve : bool
                        beneficiary: //ss58.codec('kusama').encode(
                        item.event.call?.args.beneficiary.value,
                        // ),
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Treasury.Awarded": {
                    bounties.push({
                        id: item.event.id,
                        proposalName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        amount: item.event.args.award,
                        proposalIndex: item.event.args.proposalIndex,
                        // TODO: locate item.event.call.args.approve : bool
                        beneficiary: //ss58.codec('kusama').encode(
                        item.event.call?.args.beneficiary.value, // TODO: output as ss58 account
                        // ),
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                    });
                    break;
                }
                case "Treasury.SpendApproved": {
                    bounties.push({
                        id: item.event.id,
                        proposalName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        amount: item.event.args.amount,
                        extrinsicId: item.event.extrinsic?.id,
                        proposalIndex: item.event.args.proposalIndex,
                        // TODO: locate item.event.call.args.approve : bool
                        beneficiary: //ss58.codec('kusama').encode(
                        item.event.call?.args.beneficiary.value,
                        // ),
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    });
                    break;
                }
                case "Treasury.Spending": {
                    bounties.push({
                        id: item.event.id,
                        proposalName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        amount: item.event.args.budgetRemaining,
                    });
                    break;
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