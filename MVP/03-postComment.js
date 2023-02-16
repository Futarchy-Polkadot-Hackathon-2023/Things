/* Mock Data Input */
const dataInput = {
  proposalIndex: "229",
  comment: "Sweet Comment",
};

/* Mock Data Output */
const dataOutput = {
  status: "true",
};

/* Main function Declartion */
import {Polkassembly} from './polkassembly.js'
async function postComment(dataInput) {
  console.log(dataInput)

  console.log("\x1b[1m","...postComment()...","\x1b[0m");
  let proposalIndex = dataInput.proposalIndex
  /*Conversion*/
  let postId = "1617"
  let p = new Polkassembly();
  let polkassemblyResponse = await p.post(postId, dataInput.comment);

  console.log(dataOutput)
  return polkassemblyResponse;
}

/* Main function Calling */
postComment(dataInput);

/* Export */
export { postComment };
