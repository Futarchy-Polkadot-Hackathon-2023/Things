async function (){
const resondse = fetch("https://polkadot.polkassembly.io/v1/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en,de-DE;q=0.9,de;q=0.8,en-US;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://polkadot.polkassembly.io/login",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"operationName\":\"LOGIN\",\"variables\":{\"password\":\"Hacker151\",\"username\":\"FrankBevr\"},\"query\":\"mutation LOGIN($password: String!, $username: String!) {\\n  login(password: $password, username: $username) {\\n    token\\n    __typename\\n  }\\n}\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

const solved = await sesponse()
console.log(solved)
}
bla()
