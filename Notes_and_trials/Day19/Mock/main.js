import { getData } from "./01-getData.js";
import { createMarket } from "./02-createMarket.js";
import { postComment } from "./03-postComment.js";

function main() {
  const getDataOutput = getData(getDataInput);
  const createMarketOuput = createMarket(getDataOutput);
  postComment(createMarketOuput);
}

