# Follow Moonbeam XCM Tutorial

[Link to Docs](https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/)

1. Read Introduction.
- XCM means Cross-Consensus Message (XCM)
- It allows to use regular Ethereum Tools.
2. Read Types XC-20s
- all cross chains assets are name with xc
- xc-20 are in two shape. xc-20 and mintable xc-20
- mintable x-20 are mint and managed by moonbeam
3. Read XC20 vs ERC-20
- ERC20 and XC-20 are similar but diffrent
- They are both availabe Ethereum API and Substragte API
4. Read ERC-20 Solidity Interfac
- It has the following interface. name(), symbol(), decimals(), totalSupply(), balanceOf(), allowance(),transfer(),approve(),transferFrom(), Transfer(), Approval()
- mintable xc-20 has specialties, like roles
5. Read ERC-20 Permit Solidity Interace
- There is a Permit.sol File.
- approve is little bit modified.
- The permit.sol interface has the follwing. permit(), nonces(), Domanin_sperator(),Permit_domain(),name(),version(),chainId(),verifyingContract()
- domain seprator is special
6. Read Interact with the Precompile using Remix



