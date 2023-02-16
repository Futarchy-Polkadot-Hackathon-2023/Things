import web2Creds from  "./secrets/web2Creds";

const polkassemblyClient={

  login: ( {creds=web2Creds} )=> new Promise ((resolve, reject) => {
    // use web2Creds to login
    if (successful) {
      resolve (bearerToken);
    }
    if (gotError) {
      reject (theError);
    }
    // if neither, do nothing, 
    //  because login function returns this promise, and the (resolve, reject)=>{} function 
    // will resolve or reject when it gets a definite answer to act upon
  })


}

export default { polkassemblyClient }
