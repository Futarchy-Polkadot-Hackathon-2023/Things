import SDK from "@zeitgeistpm/sdk";


const websocketEndpoint = "wss://roc.zeitgeist.pm";
// endpoint = "wss://bsr.zeitgeist.pm",

class ZeitgeistManager {
    constructor(endpoint) {
        this._endpoint = endpoint;
    }

    async getSdk(){
        return await SDK.default.initialize(this._endpoint);
    }
    async getDefaultSdk(){
        return await SDK.default.initialize();
    }
    async jsonify (promise) {
        return (await promise).toJSONString();
    }

    async getMarketCount() {
        const sdk = await this.getDefaultSdk();
        return sdk.models.getMarketCount();
    }

    async getAllMarketIds() {
        const sdk = await this.getDefaultSdk();
        return sdk.models.getAllMarketIds();
    }

    async queryMarket(marketId) {
        const sdk = await this.getDefaultSdk();
        //return (await sdk.models.queryMarket(marketId)).toJSONString();
        return this.jsonify(sdk.models.queryMarket(marketId))
    }

    async createScalarMarket(baseAsset, oracle, period, gracePeriod, oracleDuration, disputeDuration, bounds,
                             advised, endpoint, seed, timestamp, cpmm, metadata, disputeMechanism) {
        const sdk = await this.getDefaultSdk();
        const signer = sdk.util.signerFromSeed(seed);
        const marketPeriod = timestamp
            ? { timestamp: period.split(` `).map((x) => +x) }
            : { block: period.split(` `).map((x) => +x) };
        const deadlines = {
            gracePeriod: gracePeriod,
            oracleDuration: oracleDuration,
            disputeDuration: disputeDuration,
        };

        sdk.models.createMarket({
            signer,
            baseAsset,
            oracle,
            period: marketPeriod,
            deadlines,
            metadata,
            creationType: advised ? `Advised` : `Permissionless`,
            marketType: { scalar: bounds ? bounds : ["0", "100"] },
            disputeMechanism,
            scoringRule: cpmm ? `CPMM` : `RikiddoSigmoidFeeMarketEma`,
            callbackOrPaymentInfo: false,
        });
    }

}

const ztgManager = new ZeitgeistManager(websocketEndpoint);

const market_123 = await ztgManager.queryMarket(123)
console.log(market_123);
// console.log(await ztgManager.getAllMarketIds());