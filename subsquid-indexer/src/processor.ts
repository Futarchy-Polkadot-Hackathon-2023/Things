import {lookupArchive} from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import {In} from "typeorm"
import {Account, Transfer, Bounty} from "./model"
import {BalancesTransferEvent} from "./types/events"


const processor = new SubstrateBatchProcessor()
    .setDataSource({
        // Lookup archive by the network name in the Subsquid registry
        //archive: lookupArchive("kusama", {release: "FireSquid"})

        // Use archive created by archive/docker-compose.yml
        archive: lookupArchive('kusama', {release: 'FireSquid'} )
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
    } as const)


type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>


processor.run(new TypeormDatabase(), async ctx => {
    let transfersData = getTransfers(ctx)
    let bountiesData = getBounties(ctx)

    let accountIds = new Set<string>()
    for (let t of transfersData) {
        accountIds.add(t.from)
        accountIds.add(t.to)
    }

    let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then(accounts => {
        return new Map(accounts.map(a => [a.id, a]))
    })

    let transfersToStore: Transfer[] = []
    let bountiesToStore: Bounty[] = []

    for (let t of transfersData) {
        let {id, blockNumber, timestamp, extrinsicHash, amount, fee} = t

        let from = getAccount(accounts, t.from)
        let to = getAccount(accounts, t.to)

        transfersToStore.push(new Transfer({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            from,
            to,
            amount,
            fee
        }))
    }

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
            extrinsicHash,
            extrinsicSuccess ,
            // extrinsicError?, 
            extrinsicId,
            callArgsIndex,
            eventArgsIndex, 
            // proposalIndex, 
            proposalHash,
            // approve,
            // proposer?: 
            fee
        }))
    }

    await ctx.store.save(Array.from(accounts.values()))
    await ctx.store.insert(transfersToStore)
    await ctx.store.insert(bountiesToStore)
})


interface TransferEvent {
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    from: string
    to: string
    amount: bigint
    fee?: bigint
}

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


function getTransfers(ctx: Ctx): TransferEvent[] {
    let transfers: TransferEvent[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == "Balances.Transfer") {
                let e = new BalancesTransferEvent(ctx, item.event)
                let rec: {from: Uint8Array, to: Uint8Array, amount: bigint}
                if (e.isV1020) {
                    let [from, to, amount] = e.asV1020
                    rec = { from, to, amount}
                } else if (e.isV1050) {
                    let [from, to, amount] = e.asV1050
                    rec = { from, to, amount}
                } else if (e.isV9130) {
                    rec = e.asV9130
                } else {
                    throw new Error('Unsupported spec')
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
                })
            }
        }
    }
    return transfers
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
                        bountyIndex: item.event.args,
                        extrinsicHash: item.event.extrinsic?.hash,
                        extrinsicSuccess: item.event.extrinsic?.success,
                        // extrinsicError: item.event.extrinsic?.error?,
                        extrinsicId: item.event.extrinsic?.id,
                        eventArgs: item.event.args,
                        eventArgsIndex: item.event.args.index,
                        callArgs: item.event.call?.args,
                        callArgsIndex: item.event.call?.args.index,
                        callArgsBountyId: item.event.call?.args.bountyId,
                        callArgsBountyRemark: item.event.call?.args.remark,
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
                        bountyIndex: item.event.args[0],
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
                    })
                    break
                }
                
                case "Bounties.BountyAwarded": {                
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args.index,
                        // bountyIndex: item.event.call.args.call.value.bountyId,
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
                    })
                    break
                }

                case "Bounties.BountyBecameActive": {     
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args.index,
                        eventArgsIndex: item.event.args.index,
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
                        bountyIndex: item.event.args.index,
                        // bountyIndex: item.event.call.args.bountyId,
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
                    })
                    break
                }
                
                case "Bounties.BountyExtended": {    
                    bounties.push({
                        id: item.event.id,
                        bountyName: item.event.name,
                        blockNumber: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        bountyIndex: item.event.args,
                        // bountyIndex: item.event.call.args.call.value.call.value.bountyId,
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
