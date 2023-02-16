/* Mock Data Input */
const dataInput = {
  iGetDataA: "",
  iGetDataB: "",
  iGetDataC: "",
};
/* Mock Data Output */
const dataOutput = {
  oGetDataA: "",
  oGetDataB: "",
  oGetDataC: "",
};

/* Main function Declartion */
function getData(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...getData()...","\x1b[0m");
  console.log(dataOutput)
  return dataOutput;
}

/* Main function Calling */
getData(dataInput);

/* Export */
export { getData };
