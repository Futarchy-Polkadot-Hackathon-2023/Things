import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {BlockHandlerContext, EvmBatchProcessor, LogHandlerContext} from '@subsquid/evm-processor'
import { events, Contract as ContractAPI, functions } from "./abi/bayc";
import { Contract, Owner, Token, Transfer } from "./model";
import { In } from "typeorm";
import { BigNumber } from "ethers";
import { maxBy } from "lodash";
import { Multicall } from "./abi/multicall";
import Axios from "axios";
import https from 'https';

const contractAddress =
  // "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85".toLowerCase();
  //BAYC
  "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D".toLowerCase();

const multicallAddress = "0x5ba1e12693dc8f9c48aad8770482f4739beed696".toLowerCase();

const tokenIdToImageUrl = new Map<string, string> ();
export const api = Axios.create({
  // baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 5000,
  httpsAgent: new https.Agent({ keepAlive: true }),
})

const processor = new EvmBatchProcessor()
.setDataSource({
  chain: process.env.RPC_ENDPOINT,
  archive: "https://eth.archive.subsquid.io",
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
  const baycDataArr: BAYCData[] = [];
  
  for (let c of ctx.blocks) {
    for (let i of c.items) {
      if (i.address === contractAddress && i.kind === "evmLog") {
        if (i.evmLog.topics[0] === events.Transfer.topic) {
          const baycData = handleTransfer({
            ...ctx,
            block: c.header,
            ...i,
          });
          baycDataArr.push(baycData);
        }
      }
    }
  }

  await saveBAYCData(
    {
      ...ctx,
      block: ctx.blocks[ctx.blocks.length - 1].header,
    },
    baycDataArr
  );
});

let contractEntity: Contract | undefined;

export async function getOrCreateContractEntity(
  ctx: BlockHandlerContext<Store>
): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await ctx.store.get(Contract, contractAddress);
    if (contractEntity == null) {
      const contractAPI = new ContractAPI(ctx, contractAddress);
      let name = "", symbol = "", totalSupply = BigNumber.from(0);
      try {
        name = await contractAPI.name();
        symbol = await contractAPI.symbol();
        totalSupply = await contractAPI.totalSupply();
      } catch (error) {
        ctx.log.warn(`[API] Error while fetching Contract metadata for address ${contractAddress}`);
        if (error instanceof Error) {
          ctx.log.warn(`${error.message}`);
        }
      }
      contractEntity = new Contract({
        id: contractAddress,
        name: name,
        symbol: symbol,
        totalSupply: totalSupply.toBigInt(),
      });
      await ctx.store.insert(contractEntity);
    }
  }
  return contractEntity;
}

type BAYCData = {
  id: string;
  from: string;
  to: string;
  tokenId: bigint;
  timestamp: Date;
  block: number;
  transactionHash: string;
};


function handleTransfer(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >
): BAYCData {
  const { evmLog, block, transaction } = ctx;

  const { from, to, tokenId } = events.Transfer.decode(evmLog);

  const baycData: BAYCData = {
    id: `${transaction.hash}-${evmLog.address}-${tokenId.toBigInt()}-${
      evmLog.index
    }`,
    from,
    to,
    tokenId: tokenId.toBigInt(),
    timestamp: new Date(block.timestamp),
    block: block.height,
    transactionHash: transaction.hash,
  };
  return baycData;
}

async function saveBAYCData(
  ctx: BlockHandlerContext<Store>,
  baycDataArr: BAYCData[]
) {
  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  for (const baycData of baycDataArr) {
    tokensIds.add(baycData.tokenId.toString());
    if (baycData.from) ownersIds.add(baycData.from.toLowerCase());
    if (baycData.to) ownersIds.add(baycData.to.toLowerCase());
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

  for (const baycData of baycDataArr) {
    const {
      id,
      tokenId,
      from,
      to,
      block,
      transactionHash,
      timestamp,
    } = baycData;

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
        uri: "", // will be filled-in by Multicall
        contract: await getOrCreateContractEntity(ctx),
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

  const maxHeight = maxBy(baycDataArr, data => data.block)!.block;

  const multicall = new Multicall(ctx, {height: maxHeight}, multicallAddress);

  ctx.log.info(`Calling multicall for ${baycDataArr.length} tokens...`);

  const results = await multicall.tryAggregate(functions.tokenURI, baycDataArr.map(data => [contractAddress, [BigNumber.from(data.tokenId)]] as [string, BigNumber[]]), 100);

  const tokensWithNoImage: string[] = [];

  results.forEach((res, i) => {
    let t = tokens.get(baycDataArr[i].tokenId.toString());
    if (t) {
      let uri = '';
      if (res.success) {
        uri = <string>res.value;
      } else if (res.returnData) {
        uri = <string>functions.tokenURI.tryDecodeResult(res.returnData) || '';
      }
      t.uri = uri;
      if (!tokenIdToImageUrl.has(t.id)) tokensWithNoImage.push(t.id);
    }
  })
  ctx.log.info(`Done`);
  
  await Promise.all(tokensWithNoImage.map( async (id) => {
    const t = tokens.get(id);
    if (t && t.uri) {
      try {
        const res = await api.get(t.uri);
        tokenIdToImageUrl.set(id, res.data.image);
        t.imageUrl = res.data.image;
      }
      catch (error) {
        console.log(error);
      }
    }
  }))

  await ctx.store.save([...owners.values()]);
  await ctx.store.save([...tokens.values()]);
  await ctx.store.save([...transfers]);
}
