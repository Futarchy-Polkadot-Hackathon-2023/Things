async function franksFetch(){
const res = fetch("http://localhost:4350/graphql", {
  "headers": {
    "accept": "application/json, multipart/mixed",
    "content-type": "application/json",
  },
  "body": JSON.stringify("{\"query\":\"query MyQuery {\\n  events(limit: 10) {\\n    id\\n    name\\n  }\\n}\",\"variables\":null,\"operationName\":\"MyQuery\"}"),
  "method": "POST",
});
  console.log(await res)

}
// franksFetch()

// fetch('https://rickandmortyapi.com/graphql', {
//   method: 'POST',

//   headers: {
//     "Content-Type": "application/json"
//   },


//   body: `{\"query\":\"query MyQuery {\\n  events(limit: 10) {\\n    id\\n    name\\n  }\\n}\",\"variables\":null,\"operationName\":\"MyQuery\"}`
// })
// .then(res => res.json())
// .then(res => console.log(res.data))


async function franksFetch2(){
const abc = fetch("http://localhost:4350/graphql", {
  "headers": {
    "accept": "application/json, multipart/mixed",
    "accept-language": "en,de-DE;q=0.9,de;q=0.8,en-US;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "lang=en; _ga=GA1.1.1126544559.1670403214; _ga_CD838K4GFK=GS1.1.1670425755.4.0.1670425755.0.0.0; _ga_9EGF99VK5M=GS1.1.1671104226.1.1.1671104293.0.0.0",
    "Referer": "http://localhost:4350/graphql",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"query\":\"query MyQuery {\\n  events(limit: 10) {\\n    id\\n    name\\n  }\\n}\",\"variables\":null,\"operationName\":\"MyQuery\"}",
  "method": "POST"
});
console.log(await abc)
}
// franksFetch2()

fetch('http://localhost:4350/graphql',{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({query: `
  query {
    events(limit:10){
      id
      name
    }
  }
`})
})
.then(res => res.json())
// .then(res => console.log(res.data))

// 🥳🥳🥳🥳🥳🥳
// OK now in async
//

async function franksFetch3(){
  const res = await fetch('http://localhost:4350/graphql',{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({query: `
  query {
    burns(orderBy: value_DESC){
      address
      block
      id
      txHash
      value
    }
  }
`})
})
  const resJson = await res.json()
  console.log(resJson.data)
}
franksFetch3()


