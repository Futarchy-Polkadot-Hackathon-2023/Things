// import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
// import {
//   BlockHandlerContext,
//   EvmBatchProcessor,
//   LogHandlerContext,
// } from "@subsquid/evm-processor";
// import { lookupArchive } from "@subsquid/archive-registry";
// // import assert from "assert";
// import { events } from "./abi/ens";
// import { Owner, Token, Transfer } from "./model";
// import { In } from "typeorm";
// import { Contract } from "ethers";
// // import { Burn } from './model';

// const contractAddress =
//   "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85".toLowerCase();
// const processor = new EvmBatchProcessor()
//   .setDataSource({
//     // uncomment and set RPC_ENDPOONT to enable contract state queries.
//     // Both https and wss endpoints are supported.
//     chain: process.env.RPC_ENDPOINT,

//     // Change the Archive endpoints for run the squid
//     // against the other EVM networks
//     // For a full list of supported networks and config options
//     // see https://docs.subsquid.io/develop-a-squid/evm-processor/configuration/

//     archive: lookupArchive("eth-mainnet"),
//   })
//   .addLog(contractAddress, {
//     filter: [[events.Transfer.topic]],
//     data: {
//       evmLog: {
//         topics: true,
//         data: true,
//       },
//       transaction: {
//         hash: true,
//       },
//     },
//   });

// // processor.run(new TypeormDatabase(), async (ctx) => {
// //   const ensDataArr: ENSData[] = [];
// //   for (let c of ctx.blocks) {
// //     for (let i of c.items) {
// //       if (i.address === contractAddress && i.kind === "evmLog") {
// //         if (i.evmLog.topics[0] === events.Transfer.topic) {
// //           const ensData = handleTransfer({
// //             ...ctx,
// //             block: c.header,
// //             ...i,
// //           });
// //           ensDataArr.push(ensData);
// //         }
// //       }
// //     }
// //   }
//   processor.run(new TypeormDatabase(), async (ctx) => {
//   const ensDataArr: ENSData[] = [];
//   
//   for (let c of ctx.blocks) {
//     for (let i of c.items) {
//       if (i.address === contractAddress && i.kind === "evmLog") {
//         if (i.evmLog.topics[0] === events.Transfer.topic) {
//           const ensData = handleTransfer({
//             ...ctx,
//             block: c.header,
//             ...i,
//           });
//           ensDataArr.push(ensData);
//         }
//       }
//     }
//   }

//   await saveENSData(
//     {
//       ...ctx,
//       block: ctx.blocks[ctx.blocks.length - 1].header,
//     },
//     ensDataArr
//   );
// });
//   // apply vectorized transformations and aggregations

//   // upsert batches of entities with batch-optimized ctx.store.save
//   // await ctx.store.save(burns)
// //   await saveEnsData({
// //     ...ctx,
// //     block: ctx.blocks[ctx.blocks.length - 1].header,
// //   },
// //   ensDataArr)
// // });

// // let contractEntity: Contract | undefined
// // async function getOrCreateContractEntity(store: Store): Promise<Contract>{
// //   if(contractEntity == null){
// //     contractEntity = await store.get(Contract, contractAddress)
// //     if(contractEntity == null){
// //       contractEntity = new Contract({
// //         id: contractAddress,
// //         name: "Ethereum Name Service",
// //         symbol: "ENS",
// //         totalSupply: 0n,
// //       });
// //       await store.insert(contractEntity)
// //     }
// //   }
// //   return contractEntity;
// // }

// let contractEntity: Contract | undefined;

// export async function getOrCreateContractEntity(
//   store: Store
// ): Promise<Contract> {
//   if (contractEntity == null) {
//     contractEntity = await store.get(Contract, contractAddress);
//     if (contractEntity == null) {
//       contractEntity = new Contract({
//         id: contractAddress,
//         name: "Ethereum Name Service",
//         symbol: "ENS",
//         totalSupply: 0n,
//       });
//       await store.insert(contractEntity);
//     }
//   }
//   return contractEntity;
// }

// // type ENSData = {
// //   id: string;
// //   from: string;
// //   to: string;
// //   tokenId: bigint;
// //   timestamp: bigint;
// //   block: number;
// //   transactionhash: string;
// // };

// type ENSData = {
//   id: string;
//   from: string;
//   to: string;
//   tokenId: bigint;
//   timestamp: bigint;
//   block: number;
//   transactionHash: string;
// };

// function handleTransfer(
//   ctx: LogHandlerContext<
//     Store,
//     {
//       evmLog: {
//         topics: true;
//         data: true;
//       };
//       transaction: {
//         hash: true;
//       };
//     }
//   >
// ): ENSData {
//   const { evmLog, block, transaction } = ctx;
//   const { from, to, tokenId } = events.Transfer.decode(evmLog);
//   const ensData: ENSData = {
//     id: `${transaction.hash}-${evmLog.address}-${tokenId.toBigInt()}-${
//       evmLog.index
//     }`,
//     from,
//     to,
//     tokenId: tokenId.toBigInt(),
//     timestamp: BigInt(block.timestamp),
//     block: block.height,
//     transactionhash: transaction.hash,
//   };
//   return ensData;
// }

// // async function saveEnsData(
// //   ctx: BlockHandlerContext<Store>,
// //   ensDataArr: ENSData[]
// // ) {
// //   const tokenIds: Set<string> = new Set();
// //   const ownerIds: Set<string> = new Set();
// //   for (const ensData of ensDataArr) {
// //     tokenIds.add(ensData.tokenId.toString());
// //     ownerIds.add(ensData.from.toLowerCase());
// //     ownerIds.add(ensData.to.toLowerCase());
// //   }

// //   const transfers: Set<Transfer> = new Set();

// //   const tokens: Map<string, Token> = new Map(
// //     await (
// //       await ctx.store.findBy(Token, {
// //         id: In([...tokenIds]),
// //       })
// //     ).map((token) => [token.id, token])
// //   );

// //   const owners: Map<string, Owner> = new Map(
// //     await (
// //       await ctx.store.findBy(Owner, {
// //         id: In([...ownerIds]),
// //       })
// //     ).map((owner) => [owner.id, owner])
// //   );

// //   for(const ensData of ensDataArr){
// //     const {id, tokenId, from, to, block, transactionhash, timestamp} = ensData
// //     let fromOwner = owners.get(from)

// //     if(fromOwner == null){
// //       fromOwner = new Owner({id: from.toLowerCase()})
// //       owners.set(fromOwner.id, fromOwner);
// //     }

// //     let toOwner = owners.get(to)
// //     if(toOwner == null){
// //       toOwner = new Owner({id:to.toLowerCase()})
// //       owners.set(toOwner.id, toOwner)

// //       const tokenIdString = tokenId.toString()

// //       let token = tokens.get(tokenIdString)
// //       if(token == null){
// //         token = new Token({
// //           id: tokenId.toString(),
// //           contract: await getOrCreateContractEntity(ctx.store), //
// //         })
// //         tokens.set(token.id, token)
// //       }
// //       token.owner = toOwner;

// //       const transfer = new Transfer({
// //         id, 
// //         block,
// //         timestamp,
// //         transactionhash,
// //         from: fromOwner,
// //         to: toOwner,
// //         token,
// //       })
// //       transfers.add(transfer)
// //     }
// //   }
// //   await ctx.store.save([...owners.values()])
// //   await ctx.store.save([...tokens.values()])
// //   await ctx.store.save([...transfers.values()])
// // }

// async function saveENSData(
//   ctx: BlockHandlerContext<Store>,
//   ensDataArr: ENSData[]
// ) {
//   const tokensIds: Set<string> = new Set();
//   const ownersIds: Set<string> = new Set();

//   for (const ensData of ensDataArr) {
//     tokensIds.add(ensData.tokenId.toString());
//     if (ensData.from) ownersIds.add(ensData.from.toLowerCase());
//     if (ensData.to) ownersIds.add(ensData.to.toLowerCase());
//   }

//   const tokens: Map<string, Token> = new Map(
//     (await ctx.store.findBy(Token, { id: In([...tokensIds]) })).map((token) => [
//       token.id,
//       token,
//     ])
//   );

//   const owners: Map<string, Owner> = new Map(
//     (await ctx.store.findBy(Owner, { id: In([...ownersIds]) })).map((owner) => [
//       owner.id,
//       owner,
//     ])
//   );

//   const transfers: Set<Transfer> = new Set();

//   for (const ensData of ensDataArr) {
//     const {
//       id,
//       tokenId,
//       from,
//       to,
//       block,
//       transactionHash,
//       timestamp,
//     } = ensData;

//     let fromOwner = owners.get(from);
//     if (fromOwner == null) {
//       fromOwner = new Owner({ id: from.toLowerCase() });
//       owners.set(fromOwner.id, fromOwner);
//     }

//     let toOwner = owners.get(to);
//     if (toOwner == null) {
//       toOwner = new Owner({ id: to.toLowerCase() });
//       owners.set(toOwner.id, toOwner);
//     }

//     const tokenIdString = tokenId.toString();
//     let token = tokens.get(tokenIdString);
//     if (token == null) {
//       token = new Token({
//         id: tokenIdString,
//         contract: await getOrCreateContractEntity(ctx.store),
//       });
//       tokens.set(token.id, token);
//     }
//     token.owner = toOwner;

//     if (toOwner && fromOwner) {
//       const transfer = new Transfer({
//         id,
//         block,
//         timestamp,
//         transactionHash,
//         from: fromOwner,
//         to: toOwner,
//         token,
//       });

//       transfers.add(transfer);
//     }
//   }

//   await ctx.store.save([...owners.values()]);
//   await ctx.store.save([...tokens.values()]);
//   await ctx.store.save([...transfers]);
// }






import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {BlockHandlerContext, EvmBatchProcessor, LogHandlerContext} from '@subsquid/evm-processor'
import { events } from "./abi/ens";
import { Contract, Owner, Token, Transfer } from "./model";
import { In } from "typeorm";

const contractAddress =
  "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85".toLowerCase();
const processor = new EvmBatchProcessor()
.setDataSource({
  chain: process.env.RPC_ENDPOINT,
  archive: "https://eth.archive.subsquid.io",
})
.setBlockRange({
  from: 13243690
})
.addLog(contractAddress, {
  filter: [
    [
      events.Transfer.topic,
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
  },
});


processor.run(new TypeormDatabase(), async (ctx) => {
  const ensDataArr: ENSData[] = [];
  
  for (let c of ctx.blocks) {
    for (let i of c.items) {
      if (i.address === contractAddress && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === events.Transfer.topic) {
          const ensData = handleTransfer({
            ...ctx,
            block: c.header,
            ...i,
          });
          ensDataArr.push(ensData);
        }
      }
    }
  }

  await saveENSData(
    {
      ...ctx,
      block: ctx.blocks[ctx.blocks.length - 1].header,
    },
    ensDataArr
  );
});

let contractEntity: Contract | undefined;

export async function getOrCreateContractEntity(
  store: Store
): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contractAddress);
    if (contractEntity == null) {
      contractEntity = new Contract({
        id: contractAddress,
        name: "Ethereum Name Service",
        symbol: "ENS",
        totalSupply: 0n,
      });
      await store.insert(contractEntity);
    }
  }
  return contractEntity;
}

type ENSData = {
  id: string;
  from: string;
  to: string;
  tokenId: bigint;
  timestamp: bigint;
  block: number;
  transactionHash: string;
};


function handleTransfer(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
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
    transactionHash: transaction.hash,
  };
  return ensData;
}

async function saveENSData(
  ctx: BlockHandlerContext<Store>,
  ensDataArr: ENSData[]
) {
  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  for (const ensData of ensDataArr) {
    tokensIds.add(ensData.tokenId.toString());
    if (ensData.from) ownersIds.add(ensData.from.toLowerCase());
    if (ensData.to) ownersIds.add(ensData.to.toLowerCase());
  }

  const transfers: Set<Transfer> = new Set();

  const tokens: Map<string, Token> = new Map(
    (await ctx.store.findBy(Token, { id: In([...tokensIds]) })).map((token) => [
      token.id,
      token,
    ])
  );

  const owners: Map<string, Owner> = new Map(
    (await ctx.store.findBy(Owner, { id: In([...ownersIds]) })).map((owner) => [
      owner.id,
      owner,
    ])
  );

  for (const ensData of ensDataArr) {
    const {
      id,
      tokenId,
      from,
      to,
      block,
      transactionHash,
      timestamp,
    } = ensData;

    let fromOwner = owners.get(from);
    if (fromOwner == null) {
      fromOwner = new Owner({ id: from.toLowerCase() });
      owners.set(fromOwner.id, fromOwner);
    }

    let toOwner = owners.get(to);
    if (toOwner == null) {
      toOwner = new Owner({ id: to.toLowerCase() });
      owners.set(toOwner.id, toOwner);
    }

    const tokenIdString = tokenId.toString();
    let token = tokens.get(tokenIdString);
    if (token == null) {
      token = new Token({
        id: tokenIdString,
        contract: await getOrCreateContractEntity(ctx.store),
      });
      tokens.set(token.id, token);
    }
    token.owner = toOwner;

    if (toOwner && fromOwner) {
      const transfer = new Transfer({
        id,
        block,
        timestamp,
        transactionHash,
        from: fromOwner,
        to: toOwner,
        token,
      });

      transfers.add(transfer);
    }
  }

  await ctx.store.save([...owners.values()]);
  await ctx.store.save([...tokens.values()]);
  await ctx.store.save([...transfers]);
}

