import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './0x6B175474E89094C44Da98b954EedeAC495271d0F.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([src: string, guy: string, wad: ethers.BigNumber] & {src: string, guy: string, wad: ethers.BigNumber})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    LogNote: new LogEvent<([sig: string, usr: string, arg1: string, arg2: string, data: string] & {sig: string, usr: string, arg1: string, arg2: string, data: string})>(
        abi, '0xd3d8bec38a91a5f4411247483bc030a174e77cda9c0351924c759f41453aa5e8'
    ),
    Transfer: new LogEvent<([src: string, dst: string, wad: ethers.BigNumber] & {src: string, dst: string, wad: ethers.BigNumber})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    PERMIT_TYPEHASH: new Func<[], {}, string>(
        abi, '0x30adf81f'
    ),
    allowance: new Func<[_: string, _: string], {}, ethers.BigNumber>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[usr: string, wad: ethers.BigNumber], {usr: string, wad: ethers.BigNumber}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[_: string], {}, ethers.BigNumber>(
        abi, '0x70a08231'
    ),
    burn: new Func<[usr: string, wad: ethers.BigNumber], {usr: string, wad: ethers.BigNumber}, []>(
        abi, '0x9dc29fac'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    deny: new Func<[guy: string], {guy: string}, []>(
        abi, '0x9c52a7f1'
    ),
    mint: new Func<[usr: string, wad: ethers.BigNumber], {usr: string, wad: ethers.BigNumber}, []>(
        abi, '0x40c10f19'
    ),
    move: new Func<[src: string, dst: string, wad: ethers.BigNumber], {src: string, dst: string, wad: ethers.BigNumber}, []>(
        abi, '0xbb35783b'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonces: new Func<[_: string], {}, ethers.BigNumber>(
        abi, '0x7ecebe00'
    ),
    permit: new Func<[holder: string, spender: string, nonce: ethers.BigNumber, expiry: ethers.BigNumber, allowed: boolean, v: number, r: string, s: string], {holder: string, spender: string, nonce: ethers.BigNumber, expiry: ethers.BigNumber, allowed: boolean, v: number, r: string, s: string}, []>(
        abi, '0x8fcbaf0c'
    ),
    pull: new Func<[usr: string, wad: ethers.BigNumber], {usr: string, wad: ethers.BigNumber}, []>(
        abi, '0xf2d5d56b'
    ),
    push: new Func<[usr: string, wad: ethers.BigNumber], {usr: string, wad: ethers.BigNumber}, []>(
        abi, '0xb753a98c'
    ),
    rely: new Func<[guy: string], {guy: string}, []>(
        abi, '0x65fae35e'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalSupply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[dst: string, wad: ethers.BigNumber], {dst: string, wad: ethers.BigNumber}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[src: string, dst: string, wad: ethers.BigNumber], {src: string, dst: string, wad: ethers.BigNumber}, boolean>(
        abi, '0x23b872dd'
    ),
    version: new Func<[], {}, string>(
        abi, '0x54fd4d50'
    ),
    wards: new Func<[_: string], {}, ethers.BigNumber>(
        abi, '0xbf353dbb'
    ),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    PERMIT_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.PERMIT_TYPEHASH, [])
    }

    allowance(arg0: string, arg1: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.allowance, [arg0, arg1])
    }

    balanceOf(arg0: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [arg0])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    nonces(arg0: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.nonces, [arg0])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalSupply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSupply, [])
    }

    version(): Promise<string> {
        return this.eth_call(functions.version, [])
    }

    wards(arg0: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.wards, [arg0])
    }
}
