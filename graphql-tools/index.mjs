// import fetch from 'node-fetch'

const localGraphql = "http://localhost:4350/graphql"

const comment="comment"
const postid="postid"

const keshgQuery = 
"{\"operationName\":\"AddPostComment\",\"variables\":{\"authorId\":3004,\"content\":\""+comment +"\",\"postId\":"+ postid +"},\"query\":\"mutation AddPostComment($authorId: Int!, $content: String!, $postId: Int!) {\\n  __typename\\n  insert_comments(\\n    objects: {author_id: $authorId, content: $content, post_id: $postId}\\n  ) {\\n    affected_rows\\n    __typename\\n  }\\n}\"}"

const bountyQuery1 = {
operationName:"MyQuery",
query:"query MyQuery {\n bounties(where: {bountyIndex_eq: 3}) {\n bountyIndex\n bountyName\n blockNumber\n }\n}\n",
variables:null,
};

const bountyQuery2 = `{"query":"query MyQuery {\n  bounties(where: {bountyIndex_eq: 3}) {\n    bountyIndex\n    bountyName\n    blockNumber\n  }\n}\n","variables":null,"operationName":"MyQuery"}`;


const bountyQuery3 = JSON.stringify({
  "operationName": "MyQuery",
  "query": ""



})


const doQuerySync = async (query)=> { 
  const reply = await  fetch(localGraphql, {
      "headers": {
      },
      "body": query,
      "method": "POST"
    })
    .then()


  console.log(reply);
}





doQuerySync(bountyQuery3);

console.log(keshgQuery);
// console.log(JSON.parse(keshgQuery));








// _______________________________________________________________________

const login = (user, password)=> new Promise(async (resolve, reject) => {
  const login_res = await  fetch(this.URL, {
    "headers": {
    },
    "body": "{\"operationName\":\"LOGIN\",\"variables\":{\"password\":\""+password+"\",\"username\":\""+user+"\"},\"query\":\"mutation LOGIN($password: String!, $username: String!) {\\n  login(password: $password, username: $username) {\\n    token\\n    __typename\\n  }\\n}\"}",
    "method": "POST"
  });

  login_res.json()
    then(j=> j.data.login.token)
    then(resolve);
})

const post= async (post_id=1596, comment) => {
  const token=getToken()
  if (await token) {
    let postid=post_id
    let post_res = await fetch(this.URL, {
        "headers": {
          "authorization": "Bearer "+ this.token,
          "content-type": "application/json"
        },
        "body": "{\"operationName\":\"AddPostComment\",\"variables\":{\"authorId\":3004,\"content\":\""+comment +"\",\"postId\":"+ postid +"},\"query\":\"mutation AddPostComment($authorId: Int!, $content: String!, $postId: Int!) {\\n  __typename\\n  insert_comments(\\n    objects: {author_id: $authorId, content: $content, post_id: $postId}\\n  ) {\\n    affected_rows\\n    __typename\\n  }\\n}\"}",
        "method": "POST"
      });
    }
}
