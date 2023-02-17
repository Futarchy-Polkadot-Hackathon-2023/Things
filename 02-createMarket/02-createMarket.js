 /*******************/
 /* Mock Data Input */
 /*******************/
const dataInput = {
  question: 'Will proposal with Indes of 229 resolve?',
  description: '#229 Treasury Proposal: Polkawatch, Decentralization Analytics, Continued Operation and Development',
  slug: '#229 Treas',
  proposalIndex: 229
}

 /*******************/
 /* Mock Data Output */
 /*******************/
const dataOutput = {
  proposalIndex: "229",
  comment: "A prediction market is created.🗽 \n\nGo to [Zeitgeist App - Market Link](https://app.zeitgeist.pm/markets/229) \n\n ⚠️ Currently only on the Battery-Testnet of Zeitgeist ⚠️ "
};

 /****************************/
 /* Main Function Declartion */
 /****************************/
import {ZtgManager, mainCreateMarketMockUp} from "./ztgManger.js"
async function createMarket(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...createMarket()...","\x1b[0m");
  // let manager = new ZtgManager();
  // let ZtgManagerResponse = await manager.createMarket(dataInput)
  const createMarketOutput = await mainCreateMarketMockUp(dataInput)

  const comment = `A prediction market is created.🗽 \n\nGo to [Zeitgeist App - Market Link](https://app.zeitgeist.pm/markets/${createMarketOutput.marketId}) \n\n ⚠️ Currently only on the Battery-Testnet of Zeitgeist ⚠️ `

  const dataOutput = {
    proposalIndex: "229",
    comment: comment,
  };

  console.log(dataOutput)
  console.log("---------↓-----------")
  return dataOutput;
}

 /*************************/
 /* Main Function Calling */
 /*************************/
// createMarket(dataInput);

 /**********/
 /* Export */
 /**********/
export { createMarket };
