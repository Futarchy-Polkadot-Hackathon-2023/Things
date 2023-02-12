import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { BlockHandlerContext, EvmBatchProcessor, LogHandlerContext } from "@subsquid/evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
// import assert from "assert";
import { events } from "./abi/ens";
// import { Burn } from './model';

const contractAddress =
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85".toLowerCase();
const processor = new EvmBatchProcessor()
  .setDataSource({
    // uncomment and set RPC_ENDPOONT to enable contract state queries.
    // Both https and wss endpoints are supported.
    chain: process.env.RPC_ENDPOINT,

    // Change the Archive endpoints for run the squid
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/develop-a-squid/evm-processor/configuration/

    archive: lookupArchive("eth-mainnet"),
  })
  .addLog(contractAddress, {
    filter: [[events.Transfer.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  const ensDataArr: ENSData[] = []
  for (let c of ctx.blocks) {
    for (let i of c.items) {
      if (i.address === contractAddress && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === events.Transfer.topic) {
          const ensData = handleTransfer({
            ...ctx,
            block: c.header,
            ...i
          })
          ensDataArr.push(ensData)
        }
      }
    }
  }
  // apply vectorized transformations and aggregations

  // upsert batches of entities with batch-optimized ctx.store.save
  // await ctx.store.save(burns)
});

type ENSData = {
  id: string;
  from: string;
  to: string;
  tokenId: bigint;
  timestamp: bigint;
  block: number;
  transactionhash: string;
};

function handleTransfer(
  ctx: LogHandlerContext<
    Store,
    {
      evmLog: {
        topics: true;
        data: true;
      };
      transaction: {
        hash: true;
      };
    }
  >
): ENSData {
  const { evmLog, block, transaction } = ctx;
  const { from, to, tokenId } = events.Transfer.decode(evmLog);
  const ensData: ENSData = {
    id: `${transaction.hash}-${evmLog.address}-${tokenId.toBigInt()}-${
      evmLog.index
    }`,
    from,
    to,
    tokenId: tokenId.toBigInt(),
    timestamp: BigInt(block.timestamp),
    block: block.height,
    transactionhash: transaction.hash,
  };
  return ensData;
}

async function saveEnsData(
  ctx: BlockHandlerContext<Store>,
  ensDataArr: ENSData[]
){
  const tokenIds: Set<string> = new Set();
  const ownerIds: Set<string> = new Set();
  for(const ensData of ensDataArr){
    tokenIds.add(ensData.tokenId.toString())
    ownerIds.add(ensData.from.toLowerCase())
    ownerIds.add(ensData.to.toLowerCase())
  }
}
