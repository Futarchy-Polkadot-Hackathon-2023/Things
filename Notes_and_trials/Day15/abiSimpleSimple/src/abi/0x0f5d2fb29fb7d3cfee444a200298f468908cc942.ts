import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './0x0f5d2fb29fb7d3cfee444a200298f468908cc942.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    Mint: new LogEvent<([to: string, amount: ethers.BigNumber] & {to: string, amount: ethers.BigNumber})>(
        abi, '0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885'
    ),
    MintFinished: new LogEvent<[]>(
        abi, '0xae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa08'
    ),
    Pause: new LogEvent<[]>(
        abi, '0x6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff625'
    ),
    Unpause: new LogEvent<[]>(
        abi, '0x7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b33'
    ),
    Burn: new LogEvent<([burner: string, value: ethers.BigNumber] & {burner: string, value: ethers.BigNumber})>(
        abi, '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: ethers.BigNumber] & {owner: string, spender: string, value: ethers.BigNumber})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: ethers.BigNumber] & {from: string, to: string, value: ethers.BigNumber})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    mintingFinished: new Func<[], {}, boolean>(
        abi, '0x05d2035b'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    approve: new Func<[_spender: string, _value: ethers.BigNumber], {_spender: string, _value: ethers.BigNumber}, boolean>(
        abi, '0x095ea7b3'
    ),
    totalSupply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[_from: string, _to: string, _value: ethers.BigNumber], {_from: string, _to: string, _value: ethers.BigNumber}, boolean>(
        abi, '0x23b872dd'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    unpause: new Func<[], {}, boolean>(
        abi, '0x3f4ba83a'
    ),
    mint: new Func<[_to: string, _amount: ethers.BigNumber], {_to: string, _amount: ethers.BigNumber}, boolean>(
        abi, '0x40c10f19'
    ),
    burn: new Func<[_value: ethers.BigNumber], {_value: ethers.BigNumber}, []>(
        abi, '0x42966c68'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    balanceOf: new Func<[_owner: string], {_owner: string}, ethers.BigNumber>(
        abi, '0x70a08231'
    ),
    finishMinting: new Func<[], {}, boolean>(
        abi, '0x7d64bcb4'
    ),
    pause: new Func<[], {}, boolean>(
        abi, '0x8456cb59'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    transfer: new Func<[_to: string, _value: ethers.BigNumber], {_to: string, _value: ethers.BigNumber}, boolean>(
        abi, '0xa9059cbb'
    ),
    allowance: new Func<[_owner: string, _spender: string], {_owner: string, _spender: string}, ethers.BigNumber>(
        abi, '0xdd62ed3e'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
}

export class Contract extends ContractBase {

    mintingFinished(): Promise<boolean> {
        return this.eth_call(functions.mintingFinished, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    totalSupply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSupply, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    balanceOf(_owner: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [_owner])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    allowance(_owner: string, _spender: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.allowance, [_owner, _spender])
    }
}
