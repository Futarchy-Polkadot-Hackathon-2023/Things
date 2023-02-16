/* Mock Data Input */
const dataInput = {
  proposalIndex: "229",
};
/* Mock Data Output */
const dataOutput = {
  postId: "1617",
};
/* Main function Declartion */
async function convertPropIndexToPostId(dataInput) {
  // console.log(dataInput);
  // console.log("\x1b[1m", "...convertPropIndexToPostId()...", "\x1b[0m");
  const res = await fetch("https://polkadot.polkassembly.io/v1/graphql", {
    headers: {
      authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxvcGFrZTYxNDZAZXpnaWFudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWt1c2FtYSI6Int9IiwieC1oYXN1cmEta3VzYW1hLWRlZmF1bHQiOiIiLCJ4LWhhc3VyYS1wb2xrYWRvdCI6Int9IiwieC1oYXN1cmEtcG9sa2Fkb3QtZGVmYXVsdCI6IiIsIngtaGFzdXJhLXVzZXItZW1haWwiOiJsb3Bha2U2MTQ2QGV6Z2lhbnQuY29tIiwieC1oYXN1cmEtdXNlci1pZCI6IjMwMDQifSwiaWF0IjoxNjc2NTU1NTA0LCJub3RpZmljYXRpb24iOnsibmV3UHJvcG9zYWwiOmZhbHNlLCJvd25Qcm9wb3NhbCI6dHJ1ZSwicG9zdENyZWF0ZWQiOnRydWUsInBvc3RQYXJ0aWNpcGF0ZWQiOnRydWV9LCJzdWIiOiIzMDA0IiwidXNlcm5hbWUiOiJsb3Bha2UiLCJ3ZWIzc2lnbnVwIjpmYWxzZSwiZXhwIjoxNjc2NTU5MTA0fQ.LJdXUovg1XQNjz1nPk4sVNsXYqKPMagy0D2cvweFNAQ5NodnvC7Lp9Y-Ynp3SmswLnbxG9uvkr_lNwZ0QgPV6WG45xfJnCiohOXWL-guw_IwzQ8cx7K1_GHnT3GbK-13dYoh2R1UOWBUoLhqaCp5ohGZ333Euw6pYnqkM6LFstqc28SMrxHOjPtXgrEOPZJup0AFv9aQMDwUVRyPl1i2SbIeiA5UTo-vzme_XzL7XzBgVWLlCGuoDLtIzPlEGm9iUJe2AqI5nQdf7Xj2D4cR-Y2Dxemx6Es7qMisNjiWkqtlNEUkdp90WkaJRtcVN2gCYLa6fOpQrHOdPd0Ei3FZDA",
      "content-type": "application/json",
    },
    body: `{\"operationName\":\"TreasuryProposalPostAndComments\",\"variables\":{\"id\":${dataInput.proposalIndex}},\"query\":\"query TreasuryProposalPostAndComments($id: Int!) {\\n  posts(where: {onchain_link: {onchain_treasury_proposal_id: {_eq: $id}}}) {\\n    ...treasuryProposalPost\\n    __typename\\n  }\\n}\\n\\nfragment treasuryProposalPost on posts {\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  id\\n  updated_at\\n  comments(order_by: {created_at: asc}) {\\n    ...commentFields\\n    __typename\\n  }\\n  onchain_link {\\n    ...onchainLinkTreasuryProposal\\n    ...onchainLinkProposalPost\\n    ...onchainLinkMotionPost\\n    ...onchainLinkBountyPost\\n    ...onchainLinkDiscussionPost\\n    ...onchainLinkReferendumPost\\n    ...onchainLinkTechCommitteeProposalPost\\n    __typename\\n  }\\n  title\\n  topic {\\n    id\\n    name\\n    __typename\\n  }\\n  type {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment authorFields on User {\\n  id\\n  kusama_default_address\\n  polkadot_default_address\\n  username\\n  __typename\\n}\\n\\nfragment commentFields on comments {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  replies {\\n    ...replyFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment replyFields on replies {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  comment_id\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment onchainLinkTreasuryProposal on onchain_links {\\n  id\\n  proposer_address\\n  onchain_treasury_proposal_id\\n  onchain_motion_id\\n  onchain_treasury_spend_proposal(where: {}) {\\n    id\\n    beneficiary\\n    value\\n    bond\\n    treasuryStatus(orderBy: id_DESC) {\\n      id\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkProposalPost on onchain_links {\\n  onchain_proposal {\\n    proposalId\\n    proposalStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkMotionPost on onchain_links {\\n  onchain_motion {\\n    motionProposalId\\n    motionStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkBountyPost on onchain_links {\\n  onchain_bounty {\\n    bountyId\\n    bountyStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkDiscussionPost on onchain_links {\\n  onchain_post_discussion_links {\\n    discussion_post_id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkReferendumPost on onchain_links {\\n  onchain_referendum {\\n    referendumId\\n    referendumStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkTechCommitteeProposalPost on onchain_links {\\n  onchain_tech_committee_proposal {\\n    proposalId\\n    status {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\"}`,
    method: "POST",
  });
  const resJson = await res.json();
  console.log(resJson)
  const id = await resJson.data.posts[0].id;
  const dataOutput = {
    postId: id,
  };
  // console.log(dataOutput);
  return dataOutput;
}

/* Main function Calling */
async function main(dataInput){
  convertPropIndexToPostId(dataInput);
}
main(dataInput)

/* Export */
export { convertPropIndexToPostId };
