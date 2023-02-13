// src/contract.ts
import { Store } from "@subsquid/typeorm-store";
import { Contract } from "./model";

export const contractAddress = "0x81ae0be3a8044772d04f32398bac1e1b4b215aa8";

let contractEntity: Contract | undefined;

export async function getOrCreateContractEntity(store: Store): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contractAddress);
    if (contractEntity == null) {
      contractEntity = new Contract({
        id: contractAddress,
        name: "Exosama",
        symbol: "EXO",
        totalSupply: 10000n,
      });
      await store.insert(contractEntity);
    }
  }
  return contractEntity;
}

export const CHAIN_NODE = ""
