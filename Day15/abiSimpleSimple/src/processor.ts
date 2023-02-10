import * as abi from './abi/0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem, EvmBlock} from '@subsquid/evm-processor'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {lookupArchive} from '@subsquid/archive-registry'
import {Transaction, Block, MintEvent, MintFinishedEvent, PauseEvent, UnpauseEvent, BurnEvent, ApprovalEvent, TransferEvent, ApproveFunction, TransferFromFunction, UnpauseFunction, MintFunction, BurnFunction, FinishMintingFunction, PauseFunction, TransferFunction, TransferOwnershipFunction} from './model'
import {normalize} from './util'

const CONTRACT_ADDRESS = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('eth-mainnet', {type: 'EVM'}),
    })
    .setBlockRange({
        from: 15000000
    })
    .addLog(CONTRACT_ADDRESS, {
        filter: [
            [
                abi.events['Mint'].topic,
                abi.events['MintFinished'].topic,
                abi.events['Pause'].topic,
                abi.events['Unpause'].topic,
                abi.events['Burn'].topic,
                abi.events['Approval'].topic,
                abi.events['Transfer'].topic,
            ],
        ],
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
            transaction: {
                hash: true,
            },
        } as const,
    })
    .addTransaction(CONTRACT_ADDRESS, {
        sighash: [
            abi.functions['approve'].sighash,
            abi.functions['transferFrom'].sighash,
            abi.functions['unpause'].sighash,
            abi.functions['mint'].sighash,
            abi.functions['burn'].sighash,
            abi.functions['finishMinting'].sighash,
            abi.functions['pause'].sighash,
            abi.functions['transfer'].sighash,
            abi.functions['transferOwnership'].sighash,
        ],
        data: {
            transaction: {
                hash: true,
                input: true,
            },
        } as const,
    })

type SquidEventEntity = MintEvent | MintFinishedEvent | PauseEvent | UnpauseEvent | BurnEvent | ApprovalEvent | TransferEvent
type SquidFunctionEntity = ApproveFunction | TransferFromFunction | UnpauseFunction | MintFunction | BurnFunction | FinishMintingFunction | PauseFunction | TransferFunction | TransferOwnershipFunction
type SquidEntity = SquidEventEntity | SquidFunctionEntity

processor.run(new TypeormDatabase(), async (ctx) => {
    let events: Record<string, SquidEventEntity[]> = {}
    let functions: Record<string, SquidFunctionEntity[]> = {}
    let transactions: Transaction[] = []
    let blocks: Block[] = []
    for (let {header: block, items} of ctx.blocks) {
        let b = new Block({
            id: block.id,
            number: block.height,
            timestamp: new Date(block.timestamp),
        })
        let blockTransactions = new Map<string, Transaction>()
        for (let item of items) {
            if (item.address !== CONTRACT_ADDRESS) continue
            let it: SquidEntity | undefined
            switch (item.kind) {
                case 'evmLog':
                    let e = it = parseEvmLog(ctx, block, item)
                    if (e) {
                        if (events[e.name] == null) events[e.name] = []
                        events[e.name].push(e)
                    }
                    break
                case 'transaction':
                    let f = it = parseTransaction(ctx, block, item)
                    if (f) {
                        if (functions[f.name] == null) functions[f.name] = []
                        functions[f.name].push(f)
                    }
                    break
                default:
                    continue
            }
            if (it) {
                let t = blockTransactions.get(item.transaction.id)
                if (!t) {
                    t = new Transaction({
                        id: item.transaction.id,
                        hash: item.transaction.hash,
                        contract: item.transaction.to,
                        block: b,
                    })
                    blockTransactions.set(t.id, t)
                }
                it.transaction = t
                it.block = b
            }
        }
        if (blockTransactions.size > 0) {
            blocks.push(b)
            transactions.push(...blockTransactions.values())
        }
    }
    await ctx.store.save(blocks)
    await ctx.store.save(transactions)
    for (let f in functions) {
        await ctx.store.save(functions[f])
    }
    for (let e in events) {
        await ctx.store.save(events[e])
    }
})

type Item = BatchProcessorItem<typeof processor>
type Context = BatchHandlerContext<Store, Item>

function parseEvmLog(ctx: Context, block: EvmBlock, item: BatchProcessorLogItem<typeof processor>): SquidEventEntity | undefined {
    try {
        switch (item.evmLog.topics[0]) {
            case abi.events['Mint'].topic: {
                let e = normalize(abi.events['Mint'].decode(item.evmLog))
                return new MintEvent({
                    id: item.evmLog.id,
                    name: 'Mint',
                    to: e[0],
                    amount: e[1],
                })
            }
            case abi.events['MintFinished'].topic: {
                return new MintFinishedEvent({
                    id: item.evmLog.id,
                    name: 'MintFinished',
                })
            }
            case abi.events['Pause'].topic: {
                return new PauseEvent({
                    id: item.evmLog.id,
                    name: 'Pause',
                })
            }
            case abi.events['Unpause'].topic: {
                return new UnpauseEvent({
                    id: item.evmLog.id,
                    name: 'Unpause',
                })
            }
            case abi.events['Burn'].topic: {
                let e = normalize(abi.events['Burn'].decode(item.evmLog))
                return new BurnEvent({
                    id: item.evmLog.id,
                    name: 'Burn',
                    burner: e[0],
                    value: e[1],
                })
            }
            case abi.events['Approval'].topic: {
                let e = normalize(abi.events['Approval'].decode(item.evmLog))
                return new ApprovalEvent({
                    id: item.evmLog.id,
                    name: 'Approval',
                    owner: e[0],
                    spender: e[1],
                    value: e[2],
                })
            }
            case abi.events['Transfer'].topic: {
                let e = normalize(abi.events['Transfer'].decode(item.evmLog))
                return new TransferEvent({
                    id: item.evmLog.id,
                    name: 'Transfer',
                    from: e[0],
                    to: e[1],
                    value: e[2],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}

function parseTransaction(ctx: Context, block: EvmBlock, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {
    try {
        switch (item.transaction.input.slice(0, 10)) {
            case abi.functions['approve'].sighash: {
                let f = normalize(abi.functions['approve'].decode(item.transaction.input))
                return new ApproveFunction({
                    id: item.transaction.id,
                    name: 'approve',
                    spender: f[0],
                    value: f[1],
                })
            }
            case abi.functions['transferFrom'].sighash: {
                let f = normalize(abi.functions['transferFrom'].decode(item.transaction.input))
                return new TransferFromFunction({
                    id: item.transaction.id,
                    name: 'transferFrom',
                    from: f[0],
                    to: f[1],
                    value: f[2],
                })
            }
            case abi.functions['unpause'].sighash: {
                return new UnpauseFunction({
                    id: item.transaction.id,
                    name: 'unpause',
                })
            }
            case abi.functions['mint'].sighash: {
                let f = normalize(abi.functions['mint'].decode(item.transaction.input))
                return new MintFunction({
                    id: item.transaction.id,
                    name: 'mint',
                    to: f[0],
                    amount: f[1],
                })
            }
            case abi.functions['burn'].sighash: {
                let f = normalize(abi.functions['burn'].decode(item.transaction.input))
                return new BurnFunction({
                    id: item.transaction.id,
                    name: 'burn',
                    value: f[0],
                })
            }
            case abi.functions['finishMinting'].sighash: {
                return new FinishMintingFunction({
                    id: item.transaction.id,
                    name: 'finishMinting',
                })
            }
            case abi.functions['pause'].sighash: {
                return new PauseFunction({
                    id: item.transaction.id,
                    name: 'pause',
                })
            }
            case abi.functions['transfer'].sighash: {
                let f = normalize(abi.functions['transfer'].decode(item.transaction.input))
                return new TransferFunction({
                    id: item.transaction.id,
                    name: 'transfer',
                    to: f[0],
                    value: f[1],
                })
            }
            case abi.functions['transferOwnership'].sighash: {
                let f = normalize(abi.functions['transferOwnership'].decode(item.transaction.input))
                return new TransferOwnershipFunction({
                    id: item.transaction.id,
                    name: 'transferOwnership',
                    newOwner: f[0],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
