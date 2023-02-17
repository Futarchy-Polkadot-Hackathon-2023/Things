 /*******************/
 /* Mock Data Input */
 /*******************/
const dataInput = {
  proposalIndex: "229",
  comment: "A prediction market is created.🗽 \n\nGo to [Zeitgeist App - Market Link](https://app.zeitgeist.pm/markets/229) \n\n ⚠️ Currently only on the Battery-Testnet of Zeitgeist ⚠️ "
};

 /*******************/
 /* Mock Data Output */
 /*******************/
const dataOutput = {
  status: "true",
  link: "https://polkadot.polkassembly.io/post/1301"
};

 /****************************/
 /* Main Function Declartion */
 /****************************/
import {Polkassembly} from './polkassembly.js'
async function postComment(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...postComment()...","\x1b[0m");
  let p = new Polkassembly();
  let postIdObject = await p.convertPropIndexToPostId( { proposalIndex: dataInput.proposalIndex })
  let polkassemblyResponse = await p.post(postIdObject.postId, dataInput.comment);
  const dataOutput = {
    status : polkassemblyResponse.toString(),
    link: `https://polkadot.polkassembly.io/post/${postIdObject.postId}`
  }
  console.log(dataOutput)
  console.log("---------------------")
  return dataOutput;
}

/*************************/
/* Main Function Calling */
/*************************/
// postComment(dataInput);

 /**********/
 /* Export */
 /**********/
export { postComment };
