const bearerToken =
"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWt1c2FtYSI6Int9IiwieC1oYXN1cmEta3VzYW1hLWRlZmF1bHQiOiIiLCJ4LWhhc3VyYS1wb2xrYWRvdCI6InsxNUN3cjV3cFZhWGVBTkhySDhDeWRTUVE4bWRNNjQxTjlWOHlyUmFhU2d1WGJuQTJ9IiwieC1oYXN1cmEtcG9sa2Fkb3QtZGVmYXVsdCI6IjE1Q3dyNXdwVmFYZUFOSHJIOEN5ZFNRUThtZE02NDFOOVY4eXJSYWFTZ3VYYm5BMiIsIngtaGFzdXJhLXVzZXItZW1haWwiOiIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzA0MSJ9LCJpYXQiOjE2NzU4NzY2MDQsIm5vdGlmaWNhdGlvbiI6eyJuZXdQcm9wb3NhbCI6ZmFsc2UsIm93blByb3Bvc2FsIjp0cnVlLCJwb3N0Q3JlYXRlZCI6dHJ1ZSwicG9zdFBhcnRpY2lwYXRlZCI6dHJ1ZX0sInN1YiI6IjMwNDEiLCJ1c2VybmFtZSI6IjA4MTMyNDJjZjA2MDRhOWFhZjM1MmMyYjgiLCJ3ZWIzc2lnbnVwIjp0cnVlLCJleHAiOjE2NzU4ODAyMDR9.Ly8cbGfS_j5OXGbKivgOjD67uju_nsJ-CQwAzOe71LYwGk7Wt9zSgZupQGPFaReJr5oOVYkyVj8goDMERRDpVV4g8Mno-DezA9nKXemKLlNoawRqlmxSOnMltUf2YSFE90qPRvfD-i8km2mqcCdpkSMmR1BfGRCO7Y_s_IT7u2EmXIwx8ufszrwjzPDKe01dWqJeQfVeNE1g8YIyhqPzc3gZ_ZxwsWJTa_bTy2lY9rA0vafjr_X8MHax-VunWANCgYgUEvEmk9TNhsQRRvQMek_VU4f75necmL6BHw3ntXQfQwZaBMlpDov7_YCBxXb3BEB85LzIica3B6wyK1HU6A";
const polkaAssemblyBountiID = "170";
const myComment = "This is Hello World";

fetch("https://polkadot.polkassembly.io/v1/graphql", {
  headers: {
    accept: "*/*",
    "accept-language": "en,de-DE;q=0.9,de;q=0.8,en-US;q=0.7",
    authorization: `${bearerToken}`,
    "cache-control": "no-cache",
    "content-type": "application/json",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  },
  referrer: `https://polkadot.polkassembly.io/treasury/${polkaAssemblyBountiID}`,
  referrerPolicy: "strict-origin-when-cross-origin",
  body: `{\"operationName\":\"AddPostComment\",\"variables\":{\"authorId\":3041,\"content\":\"${myComment}\",\"postId\":1301},\"query\":\"mutation AddPostComment($authorId: Int!, $content: String!, $postId: Int!) {\\n  __typename\\n  insert_comments(\\n    objects: {author_id: $authorId, content: $content, post_id: $postId}\\n  ) {\\n    affected_rows\\n    __typename\\n  }\\n}\"}`,
  method: "POST",
  mode: "cors",
  credentials: "include",
});


