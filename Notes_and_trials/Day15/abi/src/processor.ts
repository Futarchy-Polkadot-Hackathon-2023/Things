import * as abi from './abi/0x6B175474E89094C44Da98b954EedeAC495271d0F'
import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem, EvmBlock} from '@subsquid/evm-processor'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {lookupArchive} from '@subsquid/archive-registry'
import {Transaction, Block, ApprovalEvent, LogNoteEvent, TransferEvent, ApproveFunction, BurnFunction, DenyFunction, MintFunction, MoveFunction, PermitFunction, PullFunction, PushFunction, RelyFunction, TransferFunction, TransferFromFunction} from './model'
import {normalize} from './util'

const CONTRACT_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('eth-mainnet', {type: 'EVM'}),
    })
    .setBlockRange({
        from: 1
    })
    .addLog(CONTRACT_ADDRESS, {
        filter: [
            [
                abi.events['Approval'].topic,
                abi.events['LogNote'].topic,
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
            abi.functions['burn'].sighash,
            abi.functions['deny'].sighash,
            abi.functions['mint'].sighash,
            abi.functions['move'].sighash,
            abi.functions['permit'].sighash,
            abi.functions['pull'].sighash,
            abi.functions['push'].sighash,
            abi.functions['rely'].sighash,
            abi.functions['transfer'].sighash,
            abi.functions['transferFrom'].sighash,
        ],
        data: {
            transaction: {
                hash: true,
                input: true,
            },
        } as const,
    })

type SquidEventEntity = ApprovalEvent | LogNoteEvent | TransferEvent
type SquidFunctionEntity = ApproveFunction | BurnFunction | DenyFunction | MintFunction | MoveFunction | PermitFunction | PullFunction | PushFunction | RelyFunction | TransferFunction | TransferFromFunction
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
            case abi.events['Approval'].topic: {
                let e = normalize(abi.events['Approval'].decode(item.evmLog))
                return new ApprovalEvent({
                    id: item.evmLog.id,
                    name: 'Approval',
                    src: e[0],
                    guy: e[1],
                    wad: e[2],
                })
            }
            case abi.events['LogNote'].topic: {
                let e = normalize(abi.events['LogNote'].decode(item.evmLog))
                return new LogNoteEvent({
                    id: item.evmLog.id,
                    name: 'LogNote',
                    sig: e[0],
                    usr: e[1],
                    arg1: e[2],
                    arg2: e[3],
                    data: e[4],
                })
            }
            case abi.events['Transfer'].topic: {
                let e = normalize(abi.events['Transfer'].decode(item.evmLog))
                return new TransferEvent({
                    id: item.evmLog.id,
                    name: 'Transfer',
                    src: e[0],
                    dst: e[1],
                    wad: e[2],
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
                    usr: f[0],
                    wad: f[1],
                })
            }
            case abi.functions['burn'].sighash: {
                let f = normalize(abi.functions['burn'].decode(item.transaction.input))
                return new BurnFunction({
                    id: item.transaction.id,
                    name: 'burn',
                    usr: f[0],
                    wad: f[1],
                })
            }
            case abi.functions['deny'].sighash: {
                let f = normalize(abi.functions['deny'].decode(item.transaction.input))
                return new DenyFunction({
                    id: item.transaction.id,
                    name: 'deny',
                    guy: f[0],
                })
            }
            case abi.functions['mint'].sighash: {
                let f = normalize(abi.functions['mint'].decode(item.transaction.input))
                return new MintFunction({
                    id: item.transaction.id,
                    name: 'mint',
                    usr: f[0],
                    wad: f[1],
                })
            }
            case abi.functions['move'].sighash: {
                let f = normalize(abi.functions['move'].decode(item.transaction.input))
                return new MoveFunction({
                    id: item.transaction.id,
                    name: 'move',
                    src: f[0],
                    dst: f[1],
                    wad: f[2],
                })
            }
            case abi.functions['permit'].sighash: {
                let f = normalize(abi.functions['permit'].decode(item.transaction.input))
                return new PermitFunction({
                    id: item.transaction.id,
                    name: 'permit',
                    holder: f[0],
                    spender: f[1],
                    nonce: f[2],
                    expiry: f[3],
                    allowed: f[4],
                    v: f[5],
                    r: f[6],
                    s: f[7],
                })
            }
            case abi.functions['pull'].sighash: {
                let f = normalize(abi.functions['pull'].decode(item.transaction.input))
                return new PullFunction({
                    id: item.transaction.id,
                    name: 'pull',
                    usr: f[0],
                    wad: f[1],
                })
            }
            case abi.functions['push'].sighash: {
                let f = normalize(abi.functions['push'].decode(item.transaction.input))
                return new PushFunction({
                    id: item.transaction.id,
                    name: 'push',
                    usr: f[0],
                    wad: f[1],
                })
            }
            case abi.functions['rely'].sighash: {
                let f = normalize(abi.functions['rely'].decode(item.transaction.input))
                return new RelyFunction({
                    id: item.transaction.id,
                    name: 'rely',
                    guy: f[0],
                })
            }
            case abi.functions['transfer'].sighash: {
                let f = normalize(abi.functions['transfer'].decode(item.transaction.input))
                return new TransferFunction({
                    id: item.transaction.id,
                    name: 'transfer',
                    dst: f[0],
                    wad: f[1],
                })
            }
            case abi.functions['transferFrom'].sighash: {
                let f = normalize(abi.functions['transferFrom'].decode(item.transaction.input))
                return new TransferFromFunction({
                    id: item.transaction.id,
                    name: 'transferFrom',
                    src: f[0],
                    dst: f[1],
                    wad: f[2],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
