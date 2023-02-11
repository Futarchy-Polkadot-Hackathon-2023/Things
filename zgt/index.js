import {sdk} from "@zeitgeistpm/sdk"
console.log(sdk)

// console.log("Hello World")

const postSdk = await sdk.initialize();
console.log(postSdk)

// const res = await sdk.models.getAllMarketIds();
// console.log(res)


