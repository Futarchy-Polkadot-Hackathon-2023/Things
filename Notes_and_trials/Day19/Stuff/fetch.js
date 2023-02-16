fetch("http://localhost:4350/graphql", {
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
  "body": "{\"query\":\"query MyQuery {\\n  proposals(where: {proposalIndex_gt: 230}) {\\n    id\\n    proposalName\\n    proposalIndex\\n    blockNumber\\n    timestamp\\n    fee\\n    extrinsicId\\n    beneficiary\\n    budgetRemaining\\n  }\\n}\",\"variables\":null,\"operationName\":\"MyQuery\"}",
  "method": "POST"
});
