import subsquid from "subsquid";
import zeitgeist from "zeigeist-sdk";
import provider from "somewhere";
let polkassemblyClient;

import web2Creds from  "./secrets/web2Creds";
import ztgAccount from "./secrets/ztgAccount";

const emptyMarketsObject = {
  todo : [],
  deployed : {
    pending : [],
    live : [],
    failed : []
  },
  resolved : [],
};

const emptyPolkassemblyPostsObject = {
  todo : [],
  posted : []
};

const emptyPostObject = {
  bountyNo,
  timeStamp,
  textVersion
};

const bounties = require("./cache/bounties") || {};
const markets = require("./cache/markets") || emptyMarketsObject;
const polkassemblyPosts = require("./cache/posts") || emptyPolkassemblyPostsObject;
const { lastKnownZtgBlock=0 , lastKnownKsmBlock=0 } = require("./cache");

const api = subsquid.getApi('my squid');


const bootstrap = ()=> new Promise (async (resolve, reject) => {
  const latestZtgBlock = await zeitgeist.latestBlock();
  const latestKsmBlock = await provider({ chain: 'ksm' }).latestBlock();

  const newBountyEvents = await api.query.system.events({
    query: { event: ['bountyActive', 'bountyRejected', 'bountyClaimed'] },
    first: lastKnownKsmBlock,
    last: latestKsmBlock
  });

  const newActiveBounties= newBountyEvents
    .filter(event=> event.event==='bountyActive');
  markets.todo.push.apply( markets.todo, newActiveBounties.map(marketFromNewBounty));

  const knownBountiesState = await api.query.system.state({
    bounties: bounties.map(bounty => bounty.number)
  });
  const newCloseToEndingBounties = knownBountiesState
    .filter(bounty=> bounty.events.none(event=> event==='bountyActive'))
    .map(isCloseToEnding);    
  polkassemblyPosts.todo.push.apply( polkassemblyPosts.todo, newCloseToEndingBounties.map(postFromNewBounty) );

  console.log('Found the following new bounties which have moved to the active stage: ');
  console.log('Found the following new bounties which have been rejected or claimed: ');
  console.log('Found the following already known bounties which are close to ending: ');

  resolve({ newActiveBounties, newCloseToEndingBounties }); 

})



const marketFromNewBounty = bounty =>{
  // convert the subsquid bounty event into data for creation of a zeitgeist market
}

const postFromNewBounty = bounty =>{
  // convert the subsquid bounty event into data for a polkassembly post 
}

const isCloseToEnding = bounty =>{
  // parses subsquid state (bounty param) to report if bounty is 'close' to ending 
  // (eg if it would end if 20% more votes were added, or if were to stay as is for 48 hours)
}
    
const updateAll= async toDos=> {
  if (toDos) {
    if (!polkassemblyClient.active())
    await polkassemblyClient.login();
  }
  const { newActiveBounties, newCloseToEndingBounties } = toDos;
  for (bounty in newActiveBounties) {
    doCreateMarket(bounty)
      .then (market=> {
        const newPost = postFromNewBounty(bounty);
        polkassemblyPosts.todo.push(newPost);
        doCreatePost(newPost);
      });
  }
}


bootstrap()
  .then(updateAll);

setInterval(()=>{
  bootstrap()
    .then(updateAll);
}, 5*60*1000);
