[YT Link](https://www.youtube.com/watch?v=x4fEP0KJ3OE&list=PLH2948XqklrgTvG6-ro3eqS17j7n_raiN)

# 1 - Welcome

prerequiste: nodejs, docker, linux, typescript

have your terminal open while following along

discord for help

# 2 What is subsquid? 

- Indexing middelware is neccessary.
- ingest on chain data
- data proccession

- why
- web2 came up with diffrent data solution, like data warehouses, datalakes, ...
- web3 current chaindata is all saved on chain, web2 in 1995
- it can hel thruh typesafe extraction, scaling, dataextrintion, 
- perfect for analyitics or marketplaces or ...
- organic scale

# 3 Subsquid Architecture

- modluar architecture
- chain, processing, presenting
- modular --> achives
- Why we need archive, it helps to not extract data multiple times.
- it helps for better storate, filtering, reducing network overhead, modularity helps future adaptiablity

- Why squids? 
- squids are processing steps
- subsquid does things good, it seems
- developing squid --> blockchain --> squid archive --> process --> data --> graphql

# 4 Squid structure

- There is a template its called squid-evm-template
- A suqid is in the end a nodeJs project
- `gh repo clone subsquid-labs/squid-evm-template`
- `npm i`
- `vim schema.graphql`
- `npm run build`
- `docker compose up -d`
- `npx squid-typeorm-migration apply`
- `node -r dotenv/config lib/processor.js`

# 5 EVM Log Indexing
- Intro, schema and models, typescript facades for evml logs, mapping logic, run and veriy
- Project: ENS token
- Thats the ERC721 Token [Link](https://etherscan.io/token/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85)
- the logs are in a transaction

#6 Schema
- `gh repo clone subsquid-labs/squid-evm-template ens-project`
- `npm i`
- `vim schema.graphql`
- add ```graphql
type Token @entity{
  id: ID!
  owner: Owner
  transfers: [Transfer!]! @derivedFrom(field: "token")
  contract: Contract
}

type Owner @entity{
  id:ID!
  ownedTokens: [Token!] @derivedFrom(field: "owner")
}

type Contract @entity{
  id: ID!
  name: String! @index
  symbol: String!
  totalSupply: BigInt!
  tokens: [Token!]! @derivedFrom(field: "contract")
}

type Transfer @entity{
  id: ID!
  token: Token!
  from: Owner
  to: Owner
  timestamp: BigInt!
  block: Int! @index
  transactionHash: String
}
```
- `make codegen` 
- now there is a new file in the folder src/model/generated

# EVM Typegen
