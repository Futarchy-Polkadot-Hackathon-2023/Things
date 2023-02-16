#!/bin/bash
# curl 'https://polkadot.polkassembly.io/v1/graphql' \
#   -H 'authority: polkadot.polkassembly.io' \
#   -H 'accept: */*' \
#   -H 'accept-language: en,de-DE;q=0.9,de;q=0.8,en-US;q=0.7' \
#   -H 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWt1c2FtYSI6Int9IiwieC1oYXN1cmEta3VzYW1hLWRlZmF1bHQiOiIiLCJ4LWhhc3VyYS1wb2xrYWRvdCI6InsxNUN3cjV3cFZhWGVBTkhySDhDeWRTUVE4bWRNNjQxTjlWOHlyUmFhU2d1WGJuQTJ9IiwieC1oYXN1cmEtcG9sa2Fkb3QtZGVmYXVsdCI6IjE1Q3dyNXdwVmFYZUFOSHJIOEN5ZFNRUThtZE02NDFOOVY4eXJSYWFTZ3VYYm5BMiIsIngtaGFzdXJhLXVzZXItZW1haWwiOiIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzA0MSJ9LCJpYXQiOjE2NzU3NjI0NDEsIm5vdGlmaWNhdGlvbiI6eyJuZXdQcm9wb3NhbCI6ZmFsc2UsIm93blByb3Bvc2FsIjp0cnVlLCJwb3N0Q3JlYXRlZCI6dHJ1ZSwicG9zdFBhcnRpY2lwYXRlZCI6dHJ1ZX0sInN1YiI6IjMwNDEiLCJ1c2VybmFtZSI6IjA4MTMyNDJjZjA2MDRhOWFhZjM1MmMyYjgiLCJ3ZWIzc2lnbnVwIjp0cnVlLCJleHAiOjE2NzU3NjYwNDF9.Vi_NwLDJMijBBzrnR0fcgIa4UEZ8PPxfFl5DJWchmlN3KdOpcjpi0wHFW3YQVNCYk4sgkP77zRrRE_-wd_kPUvQCeceZfjLEhXFBy8f_sN7QhpHJl5rGA9CCfoTvoiUJCZTQ3MnozEmE3ftwoPvavvNXP3LEcHc-4EfZB09q-v6gCYezE86nngKZ07Idr9ffiFIXI8OeUFTfyf2rgsjqSbUamEZFDep9jiwQFdUxafePZYV4Do0Lkbbnh-FALMal9NrAcdBoQqtWIGvZvDH53_P3DwQr8E1OntJ5xEAe_woa70K76QgzgcJqUwG6xb1w3gXdY-JKhCrh6BJBe9Vgfw' \
#   -H 'cache-control: no-cache' \
#   -H 'content-type: application/json' \
#   -H 'cookie: refresh_token=a1bfee93-ddba-4acc-86fe-b8544fc1ddbe' \
#   -H 'origin: https://polkadot.polkassembly.io' \
#   -H 'pragma: no-cache' \
#   -H 'referer: https://polkadot.polkassembly.io/treasury/170' \
#   -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
#   -H 'sec-ch-ua-mobile: ?0' \
#   -H 'sec-ch-ua-platform: "Windows"' \
#   -H 'sec-fetch-dest: empty' \
#   -H 'sec-fetch-mode: cors' \
#   -H 'sec-fetch-site: same-origin' \
#   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
#   --data-raw $'{"operationName":"TreasuryProposalPostAndComments","variables":{"id":170},"query":"query TreasuryProposalPostAndComments($id: Int\u0021) {\\n  posts(where: {onchain_link: {onchain_treasury_proposal_id: {_eq: $id}}}) {\\n    ...treasuryProposalPost\\n    __typename\\n  }\\n}\\n\\nfragment treasuryProposalPost on posts {\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  id\\n  updated_at\\n  comments(order_by: {created_at: asc}) {\\n    ...commentFields\\n    __typename\\n  }\\n  onchain_link {\\n    ...onchainLinkTreasuryProposal\\n    ...onchainLinkProposalPost\\n    ...onchainLinkMotionPost\\n    ...onchainLinkBountyPost\\n    ...onchainLinkDiscussionPost\\n    ...onchainLinkReferendumPost\\n    ...onchainLinkTechCommitteeProposalPost\\n    __typename\\n  }\\n  title\\n  topic {\\n    id\\n    name\\n    __typename\\n  }\\n  type {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment authorFields on User {\\n  id\\n  kusama_default_address\\n  polkadot_default_address\\n  username\\n  __typename\\n}\\n\\nfragment commentFields on comments {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  replies {\\n    ...replyFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment replyFields on replies {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  comment_id\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment onchainLinkTreasuryProposal on onchain_links {\\n  id\\n  proposer_address\\n  onchain_treasury_proposal_id\\n  onchain_motion_id\\n  onchain_treasury_spend_proposal(where: {}) {\\n    id\\n    beneficiary\\n    value\\n    bond\\n    treasuryStatus(orderBy: id_DESC) {\\n      id\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkProposalPost on onchain_links {\\n  onchain_proposal {\\n    proposalId\\n    proposalStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkMotionPost on onchain_links {\\n  onchain_motion {\\n    motionProposalId\\n    motionStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkBountyPost on onchain_links {\\n  onchain_bounty {\\n    bountyId\\n    bountyStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkDiscussionPost on onchain_links {\\n  onchain_post_discussion_links {\\n    discussion_post_id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkReferendumPost on onchain_links {\\n  onchain_referendum {\\n    referendumId\\n    referendumStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkTechCommitteeProposalPost on onchain_links {\\n  onchain_tech_committee_proposal {\\n    proposalId\\n    status {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}"}' \
#   --compressed

curl 'https://polkadot.polkassembly.io/v1/graphql' \
  -H 'authority: polkadot.polkassembly.io' \
  -H 'accept: */*' \
  -H 'accept-language: en,de-DE;q=0.9,de;q=0.8,en-US;q=0.7' \
  -H 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWt1c2FtYSI6Int9IiwieC1oYXN1cmEta3VzYW1hLWRlZmF1bHQiOiIiLCJ4LWhhc3VyYS1wb2xrYWRvdCI6InsxNUN3cjV3cFZhWGVBTkhySDhDeWRTUVE4bWRNNjQxTjlWOHlyUmFhU2d1WGJuQTJ9IiwieC1oYXN1cmEtcG9sa2Fkb3QtZGVmYXVsdCI6IjE1Q3dyNXdwVmFYZUFOSHJIOEN5ZFNRUThtZE02NDFOOVY4eXJSYWFTZ3VYYm5BMiIsIngtaGFzdXJhLXVzZXItZW1haWwiOiIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzA0MSJ9LCJpYXQiOjE2NzU3NjI0NDEsIm5vdGlmaWNhdGlvbiI6eyJuZXdQcm9wb3NhbCI6ZmFsc2UsIm93blByb3Bvc2FsIjp0cnVlLCJwb3N0Q3JlYXRlZCI6dHJ1ZSwicG9zdFBhcnRpY2lwYXRlZCI6dHJ1ZX0sInN1YiI6IjMwNDEiLCJ1c2VybmFtZSI6IjA4MTMyNDJjZjA2MDRhOWFhZjM1MmMyYjgiLCJ3ZWIzc2lnbnVwIjp0cnVlLCJleHAiOjE2NzU3NjYwNDF9.Vi_NwLDJMijBBzrnR0fcgIa4UEZ8PPxfFl5DJWchmlN3KdOpcjpi0wHFW3YQVNCYk4sgkP77zRrRE_-wd_kPUvQCeceZfjLEhXFBy8f_sN7QhpHJl5rGA9CCfoTvoiUJCZTQ3MnozEmE3ftwoPvavvNXP3LEcHc-4EfZB09q-v6gCYezE86nngKZ07Idr9ffiFIXI8OeUFTfyf2rgsjqSbUamEZFDep9jiwQFdUxafePZYV4Do0Lkbbnh-FALMal9NrAcdBoQqtWIGvZvDH53_P3DwQr8E1OntJ5xEAe_woa70K76QgzgcJqUwG6xb1w3gXdY-JKhCrh6BJBe9Vgfw' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'cookie: refresh_token=a1bfee93-ddba-4acc-86fe-b8544fc1ddbe' \
  -H 'origin: https://polkadot.polkassembly.io' \
  -H 'pragma: no-cache' \
  -H 'referer: https://polkadot.polkassembly.io/treasury/170' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  --data-raw $'{"operationName":"AddPostComment","variables":{"authorId":3041,"content":"Testing","postId":1301},"query":"mutation AddPostComment($authorId: Int\u0021, $content: String\u0021, $postId: Int\u0021) {\\n  __typename\\n  insert_comments(\\n    objects: {author_id: $authorId, content: $content, post_id: $postId}\\n  ) {\\n    affected_rows\\n    __typename\\n  }\\n}"}' \
  --compressed
