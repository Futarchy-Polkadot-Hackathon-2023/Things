/* Mock Data Input */
const dataInput = {
  oGetDataA: "",
  oGetDataB: "",
  oGetDataC: "",
};

/* Mock Data Output */
const dataOutput = {
  oCreateMarketA: "",
  oCreateMarketB: "",
  oCreateMarketC: "",
};

/* Main function Declartion */
function createMarket(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...createMarket()...","\x1b[0m");
  console.log(dataOutput)
  return dataOutput;
}

/* Main function Calling */
createMarket(dataInput);

/* Export */
export { createMarket };
