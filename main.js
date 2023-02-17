 /*******************/
 /* Mock Data Input */
 /*******************/
 const dataInput = { 
   body: "{\"query\":\"query MyQuery {\\n  proposals(limit: 1) {\\n    proposalIndex\\n  }\\n}\\n\",\"variables\":null,\"operationName\":\"MyQuery\"}", 
 }

 /*******************/
 /* Mock Data Output */
 /*******************/
const dataOutput = {
  status: "true",
  link: "https://polkadot.polkassembly.io/post/1617"
 }

 /****************************/
 /* Main Function Declartion */
 /****************************/
import { getData } from "./01-getData/01-getData.js";
import { createMarket } from "./02-createMarket/02-createMarket.js";
import { postComment } from "./03-postComment/03-postComment.js";

async function main(dataInput) {
  let resGetData = await getData(dataInput)
  let resCreateMarket = await createMarket(resGetData)
  let resPostComment = await postComment(resCreateMarket);
}

 /*************************/
 /* Main Function Calling */
 /*************************/
main(dataInput)

 /**********/
 /* Export */
 /**********/
/* ---None-- */
