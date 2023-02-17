 /*******************/
 /* Mock Data Input */
 /*******************/
/* ---None-- */

 /*******************/
 /* Mock Data Output */
 /*******************/
/* ---None-- */

 /****************************/
 /* Main Function Declartion */
 /****************************/
class MarketCreationResult {
    marketId;
    poolId;
    success;
    isMainnet;

    getUrl() {
        if (this.isMainnet != null && this.isMainnet) {
            return `https://app.zeitgeist.pm/markets/${this.marketId}`;
        }
        return `https://test.staging.zeitgeist.pm/markets/${this.marketId}`;
    }

}

class MarketCreationArguments {
    question;
    description;
    slug;
}

 /*************************/
 /* Main Function Calling */
 /*************************/
/* ---None-- */

 /**********/
 /* Export */
 /**********/
/* ---None-- */
