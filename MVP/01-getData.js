/* Mock Data Input */
const dataInput = {
  body: "{\"query\":\"query MyQuery {\\n  proposals(limit: 1) {\\n    proposalIndex\\n  }\\n}\\n\",\"variables\":null,\"operationName\":\"MyQuery\"}",
};
/* Mock Data Output */
const dataOutput = {
  question: "Hola",
  description: "A description",
  slug: "aSlug"
};

/* Main function Declartion */
async function getData(dataInput) {
  console.log(dataInput)
  console.log("\x1b[1m","...getData()...","\x1b[0m");
  const respondse = await fetch("http://localhost:4350/graphql", {
  "headers": {
    "accept": "application/json, multipart/mixed",
    "content-type": "application/json",
  },
  "body": dataInput.body,
  "method": "POST",
});

  const jsonfy = await respondse.json()
  console.log("proposal Index is" , jsonfy.data.proposals[0].proposalIndex )
  return dataOutput;
}

/* Main function Calling */
getData(dataInput);

/* Export */
export { getData };
