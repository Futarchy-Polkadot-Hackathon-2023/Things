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

- assets external or minted, doesnt matter.
- prerequiste. Metamask, MoonbaseAlpha, Get TestTokens, precomiled 1x x20 or 1x mintable x 20,
- add interface ERC20.sol
- Paste file into remix
- compile it
- green mean amazing

7. Read Access the Precompile

- Compile it
- set injected web3 connected to moonbase alpha
- is account displayed
- rename erc20 to IER20
- deploy via `att Address` enter this `0xFFFFFFFF1FCACBD218EDC0EBA20FC2308C778080`
- now press buttons
- use ERC20 precompile [guide](https://docs.moonbeam.network/builders/pallets-precompiles/precompiles/erc20/), if you want to

### Page external xc 20

1. Read Introdution

- minted xc20 are minted on moonbeam
- there is democracy involved
- use Polkadot.js. Apps

2. Read External xc-20 solidity interace

- There is an ERC-20 Interface
- There is an Permit Interface

3. Read External xc-20 assets for Moobase Alpha
   |Origin|Symbol|XC-20 Adress|
   |-|-|-|
   |Relay Chain Alphanet|xcUNIT|0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080|
   |Basilisk Alphanet|xcBSX|0xFFfFfFfF4d0Ff56d0097BBd14920eaC488540BFA|
   |Clover Alphanet|xcCLV|0xFfFfFffFD3ba399d7D9d684D94b22767a5FA1cCA|
   |Crust/Shadow Alphanet|xcCSM|0xffFfFFFf519811215E05eFA24830Eebe9c43aCD7|
   |Integritee Alphanet|xcTEER|0xFfFfffFf4F0CD46769550E5938F6beE2F5d4ef1e|
   |Kintsugi Alphanet|xckBTC|0xFffFfFff5C2Ec77818D0863088929C1106635d26|
   |Kintsugi Alphanet|xcKINT|0xFFFfffff27C019790DFBEE7cB70F5996671B2882|
   |Litentry Alphanet|xcLIT|0xfffFFfFF31103d490325BB0a8E40eF62e2F614C0|
   |Pangolin Alphanet|xcPARING|0xFFFffFfF8283448b3cB519Ca4732F2ddDC6A6165|
   |Statemine Alphanet|xcTT1|0xfFffFfFf75976211C786fe4d73d2477e222786Ac|
4. Read Retrieve List of External XC-20
- go to polka apps
- choose moonbase alpha
- go to developer tabs
- go to storage
- select assets
- select PalletAassetsAssetDetail
- deselect include option
- Press + for makeing query
- The id is in an array, and a `,` is just a dot, because europe and so, its weird
5. Retrieve Metadata for External XC-20s
- take the Asset it, remove kommas
- select assets
- select asstesasstMetadata
- select include option
- press + for make query
- hurei you got your thingies.
5. Read Calculate External xc-20 precomile Addresses
- take your asset id
- go to goole and search for number to hex
- select the first result
- paste your asset id it
- tada you have your hex adress
- ethereum thinks you are too short
- add 8 x `F` in front of your address
- amazing you get your address
- paste this thing into remix under at adress
- now you can interact with this asset

