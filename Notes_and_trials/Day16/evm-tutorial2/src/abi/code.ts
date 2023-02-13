import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './code.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, approved: string, tokenId: ethers.BigNumber] & {owner: string, approved: string, tokenId: ethers.BigNumber})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ApprovalForAll: new LogEvent<([owner: string, operator: string, approved: boolean] & {owner: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    ERC20PaymentReleased: new LogEvent<([token: string, to: string, amount: ethers.BigNumber] & {token: string, to: string, amount: ethers.BigNumber})>(
        abi, '0x3be5b7a71e84ed12875d241991c70855ac5817d847039e17a9d895c1ceb0f18a'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
    ),
    PayeeAdded: new LogEvent<([account: string, shares: ethers.BigNumber] & {account: string, shares: ethers.BigNumber})>(
        abi, '0x40c340f65e17194d14ddddb073d3c9f888e3cb52b5aae0c6c7706b4fbc905fac'
    ),
    PaymentReceived: new LogEvent<([from: string, amount: ethers.BigNumber] & {from: string, amount: ethers.BigNumber})>(
        abi, '0x6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be770'
    ),
    PaymentReleased: new LogEvent<([to: string, amount: ethers.BigNumber] & {to: string, amount: ethers.BigNumber})>(
        abi, '0xdf20fd1e76bc69d672e4814fafb2c449bba3a5369d8359adf9e05e6fde87b056'
    ),
    SaleLive: new LogEvent<([live: boolean] & {live: boolean})>(
        abi, '0x594ac0b4ca8d0faa4c24b7ed4da22de236720d3eaf3ea347542cff512938d37e'
    ),
    Transfer: new LogEvent<([from: string, to: string, tokenId: ethers.BigNumber] & {from: string, to: string, tokenId: ethers.BigNumber})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
    WhitelistLive: new LogEvent<([live: boolean] & {live: boolean})>(
        abi, '0x033fcfd9cc0d1245d0975739b3bd6fa38727f20cfda54f4c8f817e2825ee7b8c'
    ),
}

export const functions = {
    addAdmin: new Func<[_admin: string], {_admin: string}, []>(
        abi, '0x70480275'
    ),
    adminMint: new Func<[count: ethers.BigNumber, to: string], {count: ethers.BigNumber, to: string}, []>(
        abi, '0x0dc28efe'
    ),
    approve: new Func<[to: string, tokenId: ethers.BigNumber], {to: string, tokenId: ethers.BigNumber}, []>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[owner: string], {owner: string}, ethers.BigNumber>(
        abi, '0x70a08231'
    ),
    baseUri: new Func<[], {}, string>(
        abi, '0x9abc8320'
    ),
    burn: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, []>(
        abi, '0x42966c68'
    ),
    config: new Func<[], {}, ([mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber] & {mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber})>(
        abi, '0x79502c55'
    ),
    extension: new Func<[], {}, string>(
        abi, '0x2d5537b0'
    ),
    getApproved: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0x081812fc'
    ),
    isApprovedForAll: new Func<[owner: string, operator: string], {owner: string, operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    isSaleLive: new Func<[], {}, boolean>(
        abi, '0xf71143ca'
    ),
    mint: new Func<[count: ethers.BigNumber], {count: ethers.BigNumber}, []>(
        abi, '0xa0712d68'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    ownerOf: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0x6352211e'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    payee: new Func<[index: ethers.BigNumber], {index: ethers.BigNumber}, string>(
        abi, '0x8b83209b'
    ),
    'release(address)': new Func<[account: string], {account: string}, []>(
        abi, '0x19165587'
    ),
    'release(address,address)': new Func<[token: string, account: string], {token: string, account: string}, []>(
        abi, '0x48b75044'
    ),
    'released(address,address)': new Func<[token: string, account: string], {token: string, account: string}, ethers.BigNumber>(
        abi, '0x406072a9'
    ),
    'released(address)': new Func<[account: string], {account: string}, ethers.BigNumber>(
        abi, '0x9852595c'
    ),
    removeAdmin: new Func<[_admin: string], {_admin: string}, []>(
        abi, '0x1785f53c'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    'safeTransferFrom(address,address,uint256)': new Func<[from: string, to: string, tokenId: ethers.BigNumber], {from: string, to: string, tokenId: ethers.BigNumber}, []>(
        abi, '0x42842e0e'
    ),
    'safeTransferFrom(address,address,uint256,bytes)': new Func<[from: string, to: string, tokenId: ethers.BigNumber, _data: string], {from: string, to: string, tokenId: ethers.BigNumber, _data: string}, []>(
        abi, '0xb88d4fde'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    setConfig: new Func<[_config: ([mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber] & {mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber})], {_config: ([mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber] & {mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber})}, []>(
        abi, '0x1f44305a'
    ),
    setExtension: new Func<[_extension: string], {_extension: string}, []>(
        abi, '0x7e2285aa'
    ),
    setMerkle: new Func<[_whitelist: string], {_whitelist: string}, []>(
        abi, '0x3b0403e6'
    ),
    setPaused: new Func<[_paused: boolean], {_paused: boolean}, []>(
        abi, '0x16c38b3c'
    ),
    setSupply: new Func<[_supply: ethers.BigNumber], {_supply: ethers.BigNumber}, []>(
        abi, '0x3b4c4b25'
    ),
    setUri: new Func<[_uri: string], {_uri: string}, []>(
        abi, '0x9b642de1'
    ),
    shares: new Func<[account: string], {account: string}, ethers.BigNumber>(
        abi, '0xce7c2ac2'
    ),
    supply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x047fc9aa'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    togglePublicLive: new Func<[], {}, []>(
        abi, '0x1822c15a'
    ),
    toggleWhitelistLive: new Func<[], {}, []>(
        abi, '0x568c32a3'
    ),
    tokenURI: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0xc87b56dd'
    ),
    tokensOfOwner: new Func<[owner: string], {owner: string}, Array<ethers.BigNumber>>(
        abi, '0x8462151c'
    ),
    'totalReleased(address)': new Func<[token: string], {token: string}, ethers.BigNumber>(
        abi, '0xd79779b2'
    ),
    'totalReleased()': new Func<[], {}, ethers.BigNumber>(
        abi, '0xe33b7de3'
    ),
    totalShares: new Func<[], {}, ethers.BigNumber>(
        abi, '0x3a98ef39'
    ),
    totalSupply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[from: string, to: string, tokenId: ethers.BigNumber], {from: string, to: string, tokenId: ethers.BigNumber}, []>(
        abi, '0x23b872dd'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    whitelist: new Func<[], {}, string>(
        abi, '0x93e59dc1'
    ),
    whitelistLive: new Func<[], {}, boolean>(
        abi, '0x9979a194'
    ),
    whitelistMint: new Func<[count: ethers.BigNumber, capacity: ethers.BigNumber, proof: Array<string>], {count: ethers.BigNumber, capacity: ethers.BigNumber, proof: Array<string>}, []>(
        abi, '0x63623d6f'
    ),
}

export class Contract extends ContractBase {

    balanceOf(owner: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [owner])
    }

    baseUri(): Promise<string> {
        return this.eth_call(functions.baseUri, [])
    }

    config(): Promise<([mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber] & {mintPrice: ethers.BigNumber, wlPrice: ethers.BigNumber, maxMint: ethers.BigNumber, maxMintPerTx: ethers.BigNumber})> {
        return this.eth_call(functions.config, [])
    }

    extension(): Promise<string> {
        return this.eth_call(functions.extension, [])
    }

    getApproved(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.getApproved, [tokenId])
    }

    isApprovedForAll(owner: string, operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [owner, operator])
    }

    isSaleLive(): Promise<boolean> {
        return this.eth_call(functions.isSaleLive, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    ownerOf(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.ownerOf, [tokenId])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    payee(index: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.payee, [index])
    }

    'released(address,address)'(token: string, account: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions['released(address,address)'], [token, account])
    }

    'released(address)'(account: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions['released(address)'], [account])
    }

    shares(account: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.shares, [account])
    }

    supply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.supply, [])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    tokenURI(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.tokenURI, [tokenId])
    }

    tokensOfOwner(owner: string): Promise<Array<ethers.BigNumber>> {
        return this.eth_call(functions.tokensOfOwner, [owner])
    }

    'totalReleased(address)'(token: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions['totalReleased(address)'], [token])
    }

    'totalReleased()'(): Promise<ethers.BigNumber> {
        return this.eth_call(functions['totalReleased()'], [])
    }

    totalShares(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalShares, [])
    }

    totalSupply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSupply, [])
    }

    whitelist(): Promise<string> {
        return this.eth_call(functions.whitelist, [])
    }

    whitelistLive(): Promise<boolean> {
        return this.eth_call(functions.whitelistLive, [])
    }
}
