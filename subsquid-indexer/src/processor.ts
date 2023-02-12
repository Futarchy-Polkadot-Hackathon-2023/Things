import {lookupArchive} from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import {In} from "typeorm"
import {Account, Bounty} from "./model"


const processor = new SubstrateBatchProcessor()
    .setDataSource({
        // Lookup archive by the network name in the Subsquid registry
        //archive: lookupArchive("kusama", {release: "FireSquid"})

        // Use archive created by archive/docker-compose.yml
        archive: lookupArchive('kusama', {release: 'FireSquid'} )
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
    } as const)
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
    } as const)
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
    } as const)
    .addEvent('Bounties.BountyBecameActive', {
        data: {
            event: {
                args: true
            }
        }
    } as const)
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
    } as const)
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
    } as const)
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
    } as const)


type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>


processor.run(new TypeormDatabase(), async ctx => {
    let bountiesData = getBounties(ctx)

    let accountIds = new Set<string>()
    let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then(accounts => {
        return new Map(accounts.map(a => [a.id, a]))
    })

    let bountiesToStore: Bounty[] = []

    for (let b of bountiesData) {
        let {
            id, blockNumber, timestamp, bountyName, bountyIndex, extrinsicHash, extrinsicSuccess, // extrinsicError?,  
            extrinsicId, callArgsIndex, eventArgsIndex, proposalHash, // proposalIndex, // approve, // proposer?: 
            fee 
        } = b

        // let proposer = getAccount(accounts, b.proposer)
        bountiesToStore.push(new Bounty({
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
        }))
    }

    await ctx.store.save(Array.from(accounts.values()))
    await ctx.store.insert(bountiesToStore)
})



interface BountyEvent {
    id: string
    bountyName: string
    blockNumber: number
    timestamp: Date
    bountyIndex: number
    extrinsicHash?: string
    extrinsicSuccess?: boolean
    // extrinsicError?: string
    extrinsicId?: string
    callArgs?: number
    callArgsIndex?: number
    eventArgs?: number
    eventArgsIndex?: number
    callArgsBountyId?: number
    callArgsBountyRemark?: string
    // proposalIndex: number
    proposalHash?: string    
    // approve: boolean
    // proposer?: string
    fee?: bigint
}


// NB These loops will run for every call and event, not just Bounty -related ones.
// and they will run once for the event, then once for the call.
function getBounties(ctx: Ctx): BountyEvent[] {
    let blockBountiesLength = 0;
    let bounties: BountyEvent[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {

            switch (item.name) {
                case "Bounties.BountyProposed": {                
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: 
                            item.event.args.index ||
                            item.event.args,
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    })
                    break
                }                

                case "Bounties.BountyRejected": {                
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: 
                            item.event.args.index 
                            || item.event.args[0],
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    })
                    break
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
                    })
                    break
                }

                case "Bounties.BountyBecameActive": {     
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: 
                            item.event.args.index ||
                            item.event.args,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                    })
                    break
                }
                

                case "Bounties.BountyClaimed": {                           
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        // bountyIndex: item.event.args.index || item.event.args[0],   // :/
                        // @ts-ignore
                        bountyIndex: 
                        item.event.args.index ||     // eg 15820891   (also event.call.args.bountyId)
                            item.event.args[0],      // eg 
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    })
                    break
                }
                
                case "Bounties.BountyExtended": {    
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: searchItemlikeObjectFor(item.event.call, 'bountyId')
                            || item.event.args.index  // (eg 15526366)
                            || item.event.args,     // exists (eg 7691636) but may not be correct
                        // bountyIndex: item.event.call.args.bountyIndex,     // (eg 14534356 some earlier like this, some not)
                        extrinsicId: item.event.extrinsic?.id,
                        // proposalIndex: item.event.call?.args.proposalIndex,
                        proposalHash: item.event.call?.args.proposalHash,
                        // TODO: locate item.event.call.args.approve : bool
                        // proposer: ss58.codec('kusama').encode(rec.proposer),
                        fee: item.event.extrinsic?.fee || 0n
                    })
                    break
                    
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
                    })
                    break
                }

                default: {
                    if (item.name.startsWith('Bounties')){
                        console.log(`Default case reached (due to no break or no match) \nAlready pushed bounty event *or call* at ${ block.header.height }`)
                        console.log( 'item=', item ) 
                        // @ts-ignore
                        if (item.event) {
                            // @ts-ignore
                            console.log(`Already pushed bounty event ${ item.event.name || '... BUT NO item.event.name\n'+ item.event.name.toString() } \n`)
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
    return bounties
}


function getAccount(m: Map<string, Account>, id: string): Account {
    let acc = m.get(id)
    if (acc == null) {
        acc = new Account()
        acc.id = id
        m.set(id, acc)
    }
    return acc
}

// uurgh
function searchItemlikeObjectFor(obj :  any, key : string): number | undefined {
    if (obj[key] !== undefined)
        return obj[key]
    if (obj.args !== undefined && obj.args[key] !== undefined)
        return obj.args[key]
    if (obj.value !== undefined && obj.value[key] !== undefined)
        return obj.value[key]
    if (obj.args !== undefined && obj.args.call !== undefined) {
        const iShallRecurThisOnlyOnce = obj.args.call
        if (iShallRecurThisOnlyOnce.value !== undefined && iShallRecurThisOnlyOnce.value[key] !== undefined)
            return iShallRecurThisOnlyOnce.value[key]            
        if (iShallRecurThisOnlyOnce.value !== undefined && iShallRecurThisOnlyOnce.value.call !== undefined && iShallRecurThisOnlyOnce.value.call.value !== undefined && iShallRecurThisOnlyOnce.value.call.value[key] !== undefined)
        return iShallRecurThisOnlyOnce.value.call.value[key]
    }
}