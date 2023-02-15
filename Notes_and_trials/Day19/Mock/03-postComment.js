/* Mock Data Input */
const dataInput = {
  oCreateMarketA: "",
  oCreateMarketB: "",
  oCreateMarketC: "",
};

/* Mock Data Output */
const dataOutput = {
  oPostCommentA: "",
  oPostCommentB: "",
  oPostCommentC: "",
};

/* Main function Declartion */
function postComment(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...postComment()...","\x1b[0m");
  console.log(dataOutput)
  return dataOutput;
}

/* Main function Calling */
postComment(dataInput);

/* Export */
export { postComment };
