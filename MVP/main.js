import { getData } from "./01-getData.js";
import { createMarket } from "./02-createMarket.js";
import { postComment } from "./03-postComment.js";

async function main(dataInput) {
  let resGetData = await getData(dataInput)
  let resCreateMarket = await createMarket(resGetData)
  let resPostComment = await postComment(resCreateMarket);
}

main({ body: "{\"query\":\"query MyQuery {\\n  proposals(limit: 1) {\\n    proposalIndex\\n  }\\n}\\n\",\"variables\":null,\"operationName\":\"MyQuery\"}", })
