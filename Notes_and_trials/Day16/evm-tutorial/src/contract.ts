import {Store} from '@subsquid/typeorm-store'
import {Contract} from './model'

export const contractAddress = "0xac5c7493036de60e63eb81c5e9a440b42f47ebf5"

let contractEntity: Contract | undefined;

export async function getOrCreateContractEntity(store: Store): Promise<Contract>{
  if(contractEntity == null){
    contractEntity = await store.get(Contract, contractAddress);
    if(contractEntity ==null){
      contractEntity = new Contract({
        id: contractAddress,
        name: "Exosama",
        symbol: "EXO",
        totalSupply: 10000n,
      })
      await store.insert(contractEntity)
    }
  }
  return contractEntity;
}

export const CHAIN_NODE = ""
