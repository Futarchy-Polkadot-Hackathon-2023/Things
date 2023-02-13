### Call with Tom

The following task are on the table

1. Fetch all Relaychain events and sort by Bounties via Subsquid
2. Create a market for each Bountie
3. Create a PolkaDotClient to post beneath each Bountie a comment. 
  - Market created, post link 
  - Market ends, post link

Refining the steps:

```md
1. SubquidScript to get all Boutnies from Relaychain
2. Clean it up make it nice
3. Output JSON

4. ZeitgeistScript to create Markets
5. Get respondses
6. Clean it up, make it nice
7. Output JSON

8. PolkassemblyClientScript logs in
9. PolkassemblyClientScript creates a postComment
9.1.Postcomment if market created
9.2 Postcomment if market is ending
10. Output JSON 
```

```
8 : is the function polkassemblyClient.login()
[16:43]

9: polkassemblyClient may in future check for the status of posts, but doesn't need to check our status at the moment - because we can retain this state from when the post is first made
[16:46]

9.1: The bot will create markets and, as part of that flow, will add a .todo element to PolkassamblyClient's queue (or pass each todo directly as a parameter to a function, eg polkassemblyClient.createPost() on the polkassemblyClient.
So this is just a function that polkassemblyClient exposes
[16:46]

9.2: Same - the bot will work out whether a post is needed and call, eg polkassemblyClient.createPost(),
[16:47]
maybe with an options={} object in the params specifying what kind of post?
[16:49]

10: null  ||  Error  || { success: true, postUrl : "https:///polka...." } 
```

We went to polkadotAssembly and tried to generate a output json.

That was the [link](https://polkadot.polkassembly.io/bounty/19)

That was a rough trial
```json
{
blocknumber: "#13670425",
Text: "The purpose of this bounty is to nurture and develop WebAssembly smart contracts on parachains.",
Description: "Please see this post first. Currently, based on the data, smart contract Parachains are leading the Polkadot ecosystem in terms of market adoption.",
bountieIndex: 1337,
purposerAddress:" 13VyvkXX3dYyeT7oAmaipZYNHzFJXofC5V8eqMuzd1isXY84 I",
}
```

Right click on graphql and copy as curl or nodeJSFetch
[Picture](./Picture1.png)

Then we get 
```
curl 'https://polkadot.polkassembly.io/v1/graphql' \
  -H 'authority: polkadot.polkassembly.io' \
  -H 'accept: */*' \
  -H 'accept-language: en,de-DE;q=0.9,de;q=0.8,en-US;q=0.7' \
  -H 'authorization: Bearer eyRUThtZE02NDFOOVY4eXJSYWFTZ3VYYm5BMiIsIngtaGFzdXJhLXVzZXItZW1haWwiOiIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzA0MSJ9LCJpYXQiOjE2NzU3ODI2OTEsIm5vdGlmaWNhdGlvbiI6eyJuZXdQcm9wb3NhbCI6ZmFsc2UsIm93blByb3Bvc2FsIjp0cnVlLCJwb3N0Q3JlYXRlZCI6dHJ1ZSwicG9zdFBhcnRpY2lwYXRlZCI6dHJ1ZX0sInN1YiI6IjMwNDEiLCJ1c2VybmFtZSI6IjA4MTMyNDJjZjA2MDRhOWFhZjM1MmMyYjgiLCJ3ZWIzc2lnbnVwIjp0cnVlLCJleHAiOjE2NzU3ODYyOTF9.XEpua87vBea-rOrhoDS0A0APJFXWIFClDPvDMY7ocSY8X4cgrNwjGFCm6uJvm_SopSB9bT-knTNVpE0yxdxxcrJCzXVRq89a7jqQt8UiedZIz5NJ7STYccenmXg6nmP0xaWT6UUr9-0T9BvzdqXqp3_lnxeDbjZH9C-ERI9Rk5q9q7Trn-Md9b_ZmbLa2Wi-3wbqF9w3pr6YAkzcB8vlpTxlpY0_BoQOWhWC5sDlXimFlI07mi1J9ASP1xthirfHVE8eePy-4_aMFGe-psKQkgz3EA0sxp1BSetrUKrGJ_f_xbYq0xvfl89VRLHXoNUnVEunlQDQwwTx7SkqWNHk5A' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'cookie: refresh_token=a1bfee93-ddba-4acc-86fe-b8544fc1ddbe' \
  -H 'origin: https://polkadot.polkassembly.io' \
  -H 'pragma: no-cache' \
  -H 'referer: https://polkadot.polkassembly.io/bounty/19' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  --data-raw $'{"operationName":"BountyPostAndComments","variables":{"id":19},"query":"query BountyPostAndComments($id: Int\u0021) {\\n  posts(where: {onchain_link: {onchain_bounty_id: {_eq: $id}}}) {\\n    ...bountyPost\\n    __typename\\n  }\\n}\\n\\nfragment bountyPost on posts {\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  id\\n  updated_at\\n  comments(order_by: {created_at: asc}) {\\n    ...commentFields\\n    __typename\\n  }\\n  onchain_link {\\n    ...onchainLinkBounty\\n    ...onchainLinkProposalPost\\n    ...onchainLinkDiscussionPost\\n    ...onchainLinkMotionPost\\n    ...onchainLinkReferendumPost\\n    ...onchainLinkTechCommitteeProposalPost\\n    ...onchainLinkTreasurySpendProposal\\n    __typename\\n  }\\n  title\\n  topic {\\n    id\\n    name\\n    __typename\\n  }\\n  type {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment authorFields on User {\\n  id\\n  kusama_default_address\\n  polkadot_default_address\\n  username\\n  __typename\\n}\\n\\nfragment commentFields on comments {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  replies {\\n    ...replyFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment replyFields on replies {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  comment_id\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment onchainLinkBounty on onchain_links {\\n  id\\n  proposer_address\\n  onchain_bounty_id\\n  onchain_bounty(where: {}) {\\n    id\\n    proposer\\n    value\\n    fee\\n    curatorDeposit\\n    bond\\n    bountyId\\n    curator\\n    beneficiary\\n    bountyStatus(orderBy: id_DESC) {\\n      id\\n      status\\n      blockNumber {\\n        startDateTime\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkProposalPost on onchain_links {\\n  onchain_proposal {\\n    proposalId\\n    proposalStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkDiscussionPost on onchain_links {\\n  onchain_post_discussion_links {\\n    discussion_post_id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkMotionPost on onchain_links {\\n  onchain_motion {\\n    motionProposalId\\n    motionStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkReferendumPost on onchain_links {\\n  onchain_referendum {\\n    referendumId\\n    referendumStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkTechCommitteeProposalPost on onchain_links {\\n  onchain_tech_committee_proposal {\\n    proposalId\\n    status {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkTreasurySpendProposal on onchain_links {\\n  onchain_treasury_spend_proposal {\\n    treasuryProposalId\\n    treasuryStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}"}' \
  --compressed
```

The Respondse looks like this
```
{"data":{"posts":[{"author":{"id":1,"kusama_default_address":"","polkadot_default_address":"","username":"proposal_bot","__typename":"User"},"content":"[Here](https://polkadot.polkassembly.io/post/1491) is the previous community discussion on Polkassembly. \n\n### TLDR;\nThe purpose of this bounty is to nurture and develop WebAssembly smart contracts on parachains. As Gavin mentioned in this [CoinDesk article](https://www.coindesk.com/tech/2021/05/25/polkadots-gavin-wood-webassembly-is-the-future-of-smart-contracts-but-legacy-evm-is-right-now/), WebAssembly is the future of smart contracts. However, even in the Polkadot ecosystem, EVM smart contract is the go-to-market solution now simply because lack of ecosystem toolings and dApps new developers can refer to. To bootstrap the Wasm dApps in the ecosystem, we will fund canary dApps and toolings through this bounty.\n\n### Context of This Bounty\nPlease see [this post](https://forum.polkadot.network/t/we-need-to-make-ink-showcase-projects/592) first. Currently, based on the data, smart contract Parachains are leading the Polkadot ecosystem in terms of market adoption. More projects are deploying dApps on Polkadot Parachains than making Parachains today and this trend will likely continue due to the high resource requirement to deploy a chain. The core problem is that the Polkadot ecosystem only supports EVM at the time of writing this and we are reproducing something which other L1s/L2s can do. One of Polkadot’s main differentiators and default environments is Wasm. In this bounty, we would like to push Wasm smart contracts adoption. The scope is as follows:\n\n- Create easily accessible and audited ink!/ask! smart contract showcases\n- Create ink!ubator - an incubation program to support community projects built with ink! and parachains that want to expose select APIs through contracts-pallet “chain extensions”. We will also help facilitate a smart contract auditing market.\n- Develop a React hooks library “useInk” - the missing front-end library for Dapps on Polkadot.\n\n### Bounty Proposal\n[Here](https://docs.google.com/document/d/1y2QECPsXQktVGZIat_yNKTlodviTecMZ6IbiLNQ4NLM/edit?usp=sharing) is the full bounty proposal.\n\n### Curators Candidates\n**Sam Ruberti from Parity Technologies (Address: 13zqqP37p8HjLuWr7sha9GcAcYiiDgjqoNS3YbSELtgvaAfb):**  Sam Ruberti is a Senior Rust Developer with ink! and has over twelve years of experience delivering full-stack products for companies including Bloomberg, Peloton, and Clear, and five years of experience building full-stack Dapps in production environments. He has built microservices, DeFi platforms, NFTs, and contributed to open-source libraries for Ethereum.\n\n**Sota Watanabe Astar Foundation (Address: 13VyvkXX3dYyeT7oAmaipZYNHzFJXofC5V8eqMuzd1isXY84):** Sota Watanabe is the founder of Astar Network. He joined the web3 space in 2015 and started developing Astar Network in 2019. Apart from his achievements, he is a director of the Japan Blockchain Association and used to be a blockchain researcher at the University of Tokyo and a task force member of Trusted Web led by the Japanese government. In addition to that, he was chosen for Forbes 30 Under 30 Asia in the IT division and Forbes 30 Under 30 Japan.\n\n**Hernando Castano from Parity Technologies (Address: 15FjwNSxHhaJeknJjbydSo561ti1ea8sf3Y1fA263emujzxW):** Hernando is a Core Developer at Parity Technologies. Hernando joined the blockchain space in 2017, initially curious about the world of smart contracts on Ethereum. In 2019, Hernando joined Parity Technologies to work on the Parity Ethereum client, and has since transitioned to the team working on the ink! programming language.\n\n**Markian Ivanichok 727 Ventures (address: 16FVZ2qVefqbr2zcEGVojEQBgx3nb8GqQCdjKiaq2nSs33T8):** Founder & CEO at 727.ventures, Brushfam & Dedali Metaverse. Web3 entrepreneur, Software Engineer. Brushfam onboards businesses to Polkadot WASM. Projects: Openbrush(Openzeppelin of WASM ink!), Typechain for ink!, sol2ink (transpiler from solidity to ink!), and substrate/ink! contribution itself. Also, WASM conference, was the first web3 WASM conference and gathered ~1000 participants.\n\n**Hang Yin from Phala Network (address: 12BZFbrNksTKwHtaBojnVtoN8BoXKmBFzT3xDnHh7P9t2Cg5):** Co-founder and CTO at Phala Network. 5 years of Web3 core development and entrepreneur experience. Author of Phala Network Technical Whitepaper. Lead the team to build an off-chain computing protocol based on ink! and Substrate with 30k online servers. Ex-Googler on Machine Learning before joining Web3.\n\n**Michał Świętek , Development Lead at Aleph Zero (Address: 5H6AVPSNv8GjEFiDKqhtCd6U494vGMm3r5vkzr5614sbfQnx0) :** For a couple of years, Michał has been fully devoted to the Aleph Zero project. From co-designing novel consensus mechanisms, and writing the first lines of code in core repositories, to the high-level architecture of Aleph Zero node implementation.","created_at":"2023-01-05T15:32:27.677363+00:00","id":1524,"updated_at":"2023-01-05T15:44:05.724168+00:00","comments":[{"id":"afd01fdf-e3ed-4c0b-b436-84863d1321db","author":{"id":1784,"kusama_default_address":"","polkadot_default_address":"14M94kYk31k2hY8MpnfNPRviJ4VcsFFjBhq7V2Fs9DzCVhXc","username":"easya","__typename":"User"},"replies":[],"content":"Great initiative! Showcases, examples and front-end toolkits will lead the way in bringing on board the next wave of new projects into the Dotsama ecosystem!\n\n -The EasyA Team","created_at":"2023-01-05T21:32:52.440166+00:00","updated_at":"2023-01-05T21:33:49.088614+00:00","__typename":"comments"},{"id":"42ab35e7-a00d-40db-b47c-ba244a679102","author":{"id":2792,"kusama_default_address":"","polkadot_default_address":"","username":"dennisolarfdez","__typename":"User"},"replies":[],"content":"#WASM is the Future! This is a great proposal to create/make this Brilliant future possible. Thank you","created_at":"2023-01-06T01:29:29.70781+00:00","updated_at":"2023-01-06T01:29:29.70781+00:00","__typename":"comments"},{"id":"b1fbdbb3-aa19-4cc3-a0d0-90cd6059416a","author":{"id":2717,"kusama_default_address":"","polkadot_default_address":"","username":"ncredibulld","__typename":"User"},"replies":[],"content":"This is a very reasonable approach to gain some traction towards wasm growth on astar. 👍","created_at":"2023-01-06T15:48:09.052976+00:00","updated_at":"2023-01-06T15:48:09.052976+00:00","__typename":"comments"},{"id":"4f4ada71-c7d5-42f7-b887-01f6ed1ba655","author":{"id":2341,"kusama_default_address":"","polkadot_default_address":"","username":"matt","__typename":"User"},"replies":[],"content":"Truly great proposal, future is HERE! This will help the Polkadot ecosystem accelerate innovation, recruit developers, and remain competitive and relevant in the market.  I fully endorse the development of WASM smart contracts on parachains. ","created_at":"2023-01-22T18:47:45.55055+00:00","updated_at":"2023-01-22T18:47:45.55055+00:00","__typename":"comments"},{"id":"d058e4eb-b488-4a8f-afb0-f429e7c2f572","author":{"id":2998,"kusama_default_address":"","polkadot_default_address":"11MRCY3umkZ1e2vk4WkUQdg3LaAgFU2FW5s8Mj1KWD2Xqid","username":"b93563ed522e4490bfe181bc6","__typename":"User"},"replies":[],"content":"Huge +1 to the proposal. We need more native dApps on Polkadot.","created_at":"2023-02-04T02:12:19.211346+00:00","updated_at":"2023-02-04T02:12:19.211346+00:00","__typename":"comments"}],"onchain_link":{"id":1093,"proposer_address":"13VyvkXX3dYyeT7oAmaipZYNHzFJXofC5V8eqMuzd1isXY84","onchain_bounty_id":19,"onchain_bounty":[{"id":20,"proposer":"13VyvkXX3dYyeT7oAmaipZYNHzFJXofC5V8eqMuzd1isXY84","value":"3619900000000000","fee":"0","curatorDeposit":"0","bond":"12700000000","bountyId":19,"curator":null,"beneficiary":null,"bountyStatus":[{"id":"clcj8yo1dczya0879e2rbujzf","status":"BountyProposed","blockNumber":{"startDateTime":"2023-01-05T15:31:48.016Z","number":13670425,"__typename":"BlockNumber"},"__typename":"BountyStatus"}],"__typename":"Bounty"}],"__typename":"onchain_links","onchain_proposal":[],"onchain_post_discussion_links":[],"onchain_motion":[],"onchain_referendum":[],"onchain_tech_committee_proposal":[],"onchain_treasury_spend_proposal":[]},"title":"Wasm Smart Contracts Bounty","topic":{"id":4,"name":"Treasury","__typename":"post_topics"},"type":{"id":2,"name":"On chain","__typename":"post_types"},"__typename":"posts"}]}}
```
It contains the Kusama address of proposer, That we paste it in 
subscan and got more information. 
`13VyvkXX3dYyeT7oAmaipZYNHzFJXofC5V8eqMuzd1isXY84`
[LinktoSubscanProposer](https://polkadot.subscan.io/account/13VyvkXX3dYyeT7oAmaipZYNHzFJXofC5V8eqMuzd1isXY84)

Now we tried the reverse.
What does the zeitgeist sdk most likely need to make a market?
We went to zeitgeist Website and came up with this

```
MarketName,
Question
MarketEnds:
Outcomes (yes/no, options, range)
Oracle
MarketDescription
DeployLiquityPool
Output SubsquidScript
```

which could like in Json like this
```json
{
  marketName: "",
  question:"",
  marketEnds: "",
  outcomes:[
    {answer: "yes"},
    {option1: "",option2:""},
    {min: "", max"", tick""}
  ]
  oracle: "addressFZueGGBbnhZit",
  marketDescription: "# Markdown \nabcaasdfasdfasdfasddf",
  deployLiquityPool: "on"
}
```

### Summary

1. create query for bounties from Relaychain with Subsquid
2. Create one Market with zeitgeist SDK
3. Login with PolkadotJs in polkaassembly. Make a post.



