/*
* Usage: 
* let p = new Polkassembly();
* await p.post("1596", "sweet comment 123")
* 
* Workings:
* There is a Class, called Polkassembly.
* By initialising, 4 variables are getting set.
* These variables are token, url, user, password.
* post() is the main function.
* the rest are utilities.
* If post() gets called, the following is happening.
* 1. sets the token, which also can be named as login. :)
* 2. calls fetch and passes in postId and comment
* 3. logs out, returns true
*/

/* 
* -------PolkaAssembly-------
*/

/* Mock Data Input */
const dataInput = {
  postId: "1596",
  comment: "Sweet Comment",
};

/* Mock Data Output */
const dataOutput = {
  status: "true",
};

/* Main function Declartion */
import fetch from "node-fetch";
class Polkassembly {
  /* Sets constants URL, username, passoword */
  constructor() {
    this.token = null;
    this.URL = "https://polkadot.polkassembly.io/v1/graphql";
    this.user = "lopake";
    this.password = "Hello-123";
  }

  /* Sets bearer token */
  async set_token() {
    try {
      let login_res = await fetch(this.URL, {
        headers: {
          "content-type": "application/json",
        },
        body:
          '{"operationName":"LOGIN","variables":{"password":"' +
          this.password +
          '","username":"' +
          this.user +
          '"},"query":"mutation LOGIN($password: String!, $username: String!) {\\n  login(password: $password, username: $username) {\\n    token\\n    __typename\\n  }\\n}"}',
        method: "POST",
      });

      let j = await login_res.json();
      this.token = j.data.login.token;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /* Post() takes an post_id and a comment. Both strings */
  /* Note: If changing User, authorId has to change probably */
  async post(postId, comment) {
    try {
      if (await this.set_token()) {
        let post_res = await fetch(this.URL, {
          headers: {
            authorization: "Bearer " + this.token,
            "content-type": "application/json",
          },
          body:
            '{"operationName":"AddPostComment","variables":{"authorId":3004,"content":"' +
            comment +
            '","postId":' +
            postId +
            '},"query":"mutation AddPostComment($authorId: Int!, $content: String!, $postId: Int!) {\\n  __typename\\n  insert_comments(\\n    objects: {author_id: $authorId, content: $content, post_id: $postId}\\n  ) {\\n    affected_rows\\n    __typename\\n  }\\n}"}',
          method: "POST",
        });
        await this.logout();
        return true;
      } else {
        console.log("some error in system");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /* Logs out */
  async logout() {
    try {
      let res = await fetch(this.URL, {
        headers: {
          authorization: "Bearer " + this.token,
          "content-type": "application/json",
        },
        body: '{"operationName":"LOGOUT","variables":{},"query":"mutation LOGOUT {\\n  logout {\\n    message\\n    __typename\\n  }\\n}"}',
        method: "POST",
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  // dataInput = { proposalIndex: string }
  async  convertPropIndexToPostId(dataInput) {
  await this.set_token()
  const res = await fetch("https://polkadot.polkassembly.io/v1/graphql", {
    headers: {
      authorization: "Bearer " + this.token,
      "content-type": "application/json",
    },
    body: `{\"operationName\":\"TreasuryProposalPostAndComments\",\"variables\":{\"id\":${dataInput.proposalIndex}},\"query\":\"query TreasuryProposalPostAndComments($id: Int!) {\\n  posts(where: {onchain_link: {onchain_treasury_proposal_id: {_eq: $id}}}) {\\n    ...treasuryProposalPost\\n    __typename\\n  }\\n}\\n\\nfragment treasuryProposalPost on posts {\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  id\\n  updated_at\\n  comments(order_by: {created_at: asc}) {\\n    ...commentFields\\n    __typename\\n  }\\n  onchain_link {\\n    ...onchainLinkTreasuryProposal\\n    ...onchainLinkProposalPost\\n    ...onchainLinkMotionPost\\n    ...onchainLinkBountyPost\\n    ...onchainLinkDiscussionPost\\n    ...onchainLinkReferendumPost\\n    ...onchainLinkTechCommitteeProposalPost\\n    __typename\\n  }\\n  title\\n  topic {\\n    id\\n    name\\n    __typename\\n  }\\n  type {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment authorFields on User {\\n  id\\n  kusama_default_address\\n  polkadot_default_address\\n  username\\n  __typename\\n}\\n\\nfragment commentFields on comments {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  replies {\\n    ...replyFields\\n    __typename\\n  }\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment replyFields on replies {\\n  id\\n  author {\\n    ...authorFields\\n    __typename\\n  }\\n  comment_id\\n  content\\n  created_at\\n  updated_at\\n  __typename\\n}\\n\\nfragment onchainLinkTreasuryProposal on onchain_links {\\n  id\\n  proposer_address\\n  onchain_treasury_proposal_id\\n  onchain_motion_id\\n  onchain_treasury_spend_proposal(where: {}) {\\n    id\\n    beneficiary\\n    value\\n    bond\\n    treasuryStatus(orderBy: id_DESC) {\\n      id\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkProposalPost on onchain_links {\\n  onchain_proposal {\\n    proposalId\\n    proposalStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkMotionPost on onchain_links {\\n  onchain_motion {\\n    motionProposalId\\n    motionStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkBountyPost on onchain_links {\\n  onchain_bounty {\\n    bountyId\\n    bountyStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkDiscussionPost on onchain_links {\\n  onchain_post_discussion_links {\\n    discussion_post_id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkReferendumPost on onchain_links {\\n  onchain_referendum {\\n    referendumId\\n    referendumStatus {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment onchainLinkTechCommitteeProposalPost on onchain_links {\\n  onchain_tech_committee_proposal {\\n    proposalId\\n    status {\\n      status\\n      blockNumber {\\n        number\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\"}`,
    method: "POST",
  });
  const resJson = await res.json();
  const id = await resJson.data.posts[0].id;
  const dataOutput = {
    postId: id,
  };
  return dataOutput;
}
};

/* Main function Calling */
// Outcommet for not double calling.
// let p = new Polkassembly();
// console.log(await p.post(dataInput.postId, dataInput.comment));

/* Export */
export {
  Polkassembly
}
