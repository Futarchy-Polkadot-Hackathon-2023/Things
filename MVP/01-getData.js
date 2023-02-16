/* Mock Data Input */
const dataInput = {
  body: "{\"query\":\"query MyQuery {\\n  proposals(limit: 1) {\\n    proposalIndex\\n  }\\n}\\n\",\"variables\":null,\"operationName\":\"MyQuery\"}",
};
/* Mock Data Output */
const dataOutput = {
  question: `Will proposal with Index of XXX resolve?`,
  description: "#229 Treasury Proposal: Polkawatch, Decentralization Analytics, Continued Operation and Development",
  slug: "#229 Treas"
};

/* Main function Declartion */
import { getHeading } from "./getHeading.js"
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
  const proposalIndex = jsonfy.data.proposals[0].proposalIndex
  const getHeadingInput = {
    url: "https://polkadot.polkassembly.io/treasury/",
    proposalId: proposalIndex,
  };

  const heading = await getHeading(getHeadingInput)
  const dataOutput = {
    question: `Will proposal with Indes of ${proposalIndex} resolve?`,
    description: heading.title,
    slug: heading.title.slice(0,10)
  };

  console.log(dataOutput)
  return dataOutput;
}

/* Main function Calling */
getData(dataInput);

/* Export */
export { getData };
