/* Mock Data Input */
const dataInput = {
  question: "Hola",
  description: "A description",
  slug: "aSlug"
};

/* Mock Data Output */
const dataOutput = {
  postId: "1596",
  comment: "Sweet Comment",
};

/* Main function Declartion */
// import {ZtgManager} from "./index.js"
async function createMarket(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...createMarket()...","\x1b[0m");
  // let manager = new ZtgManager();
  // let ZtgManagerResponse = await manager.createMarket(dataInput)
  /*
  * --- WORK IN PROGRESS ---
  */
  console.log(dataOutput)
  return dataOutput;
}

/* Main function Calling */
createMarket(dataInput);

/* Export */
export { createMarket };
