// examples:
// https://github.com/zeitgeistpm/tools/blob/main/examples/index/createMarket.ts

import SDK, { util, models } from "@zeitgeistpm/sdk";
import * as dotenv from 'dotenv';
dotenv.config()

// import createCategoricalMarket from "@zeitgeistpm/cli/dist/actions";
import createCategoricalMarket from "@zeitgeistpm/cli/dist/actions/createCategoricalMarket.js";
import getAllMarketIds from "@zeitgeistpm/cli/dist/actions/getAllMarketIds.js";


//const websocketEndpoint = "wss://roc.zeitgeist.pm";
const websocketEndpoint = "wss://bsr.zeitgeist.pm";
// endpoint = "wss://bsr.zeitgeist.pm",
//  Rococo testnet  wss://roc.zeitgeist.pm
// wss://zeitgeist.api.onfinality.io/public-ws

// Initialise the provider to connect to the local node
// wss://bsr.zeitgeist.pm
// wss://bp-rpc.zeitgeist.pm


class ZeitgeistManager {
    constructor(endpoint) {
        this._endpoint = endpoint;
    }

    async getSdk(endpoint=this._endpoint) {
        return await SDK.default.initialize(endpoint);
    }
    async getDefaultSdk() {
        const opts = {
            logEndpointInitTime: true,
            ipfsClientUrl: "http://localhost:8080",
            initialConnectionTries: 5,
        }
        //return await SDK.default.initialize("wss://bsr.zeitgeist.pm", opts);
        return await SDK.default.initialize();
    }
    async jsonify (promise) {
        return (await promise).toJSONString();
    }

    async getModelsDefault() {
        const sdk = await ztgManager.getDefaultSdk();
        return new models.default(sdk.api, sdk.errorTable, {MAX_RPC_REQUESTS: 33000});
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

    async createCategoricalMarket() {
        let opts = {
            'slug': 'Will I succeed to send a zeitgeist create market request?',
            'description': 'Will I succeed to send a zeitgeist create market request?',
            'question': 'Will I succeed to send a zeitgeist create market request?',
            'advised': true,
            'cpmm': true,
            'timestamp': '1676358788',
            'categories': ['Yes', 'No'],
            'seed': 'maid ivory until crowd story liar ladder coil cricket example bulk extend', // random seed
            'oracle': "5CS2Q1XbRR1eYnxeXUm8fqq6PfK3WLfwUvCpNvGsYAjKtsUC",
            'period': '1000000'
        }
        const { slug, description, baseAsset, oracle, period, gracePeriod, oracleDuration, disputeDuration, categories, advised, endpoint, seed, question, timestamp, cpmm, estimateFee, disputeMechanism, } = opts;


        const sdk = await this.getDefaultSdk();
        const signer = util.signerFromSeed(seed);

        const categoriesMeta = categories != null
            ? categories.map((cat) => {
                return { name: cat, ticker: cat.slice(0, 5) };
            })
            : [
                { name: `Yes`, ticker: `YES` },
                { name: `No`, ticker: `NO` },
            ];
        const metadata = {
            description,
            slug,
            question,
            categories: categoriesMeta,
        };
        const marketPeriod = {
            block: period.split(" ").map((x) => +x),
        };
        // const deadlines = {
        //     gracePeriod: gracePeriod,
        //     oracleDuration: oracleDuration,
        //     disputeDuration: disputeDuration,
        // };
        // const marketId = await sdk.models.createMarket({
        //     signer,
        //     baseAsset,
        //     oracle,
        //     period: marketPeriod,
        //     deadlines,
        //     metadata,
        //     creationType: advised ? `Advised` : `Permissionless`,
        //     marketType: { categorical: categoriesMeta.length },
        //     disputeMechanism,
        //     scoringRule: cpmm ? `CPMM` : `RikiddoSigmoidFeeMarketEma`,
        //     callbackOrPaymentInfo: estimateFee,
        // });
        const mdm = { authorized: "1" };
        const creationType = "Advised";
        const scoringRule = "CPMM";
        const marketType = { Categorical: categoriesMeta.length };

        const marketId = await sdk.models.createMarket({
            signer,
            oracle,
            period: marketPeriod,
            metadata,
            creationType: creationType,
            marketType: marketType,
            disputeMechanism: mdm,
            scoringRule: scoringRule,
            callbackOrPaymentInfo: false,
        });
        console.log(marketId);
        if (estimateFee) {
            console.log("Fee estimation for transaction", marketId);
            return;
        }
        if (res && res.length > 0) {
            console.log(`\x1b[36m%s\x1b[0m`, `\ncreateCategoricalMarket successful!`);
        }
        else {
            console.log(`\x1b[36m%s\x1b[0m`, `\ncreateCategoricalMarket failed!`);
        }
    }

    async createCategoricalMarket2() {
        // Initialise the provider to connect to the local node
        // wss://bsr.zeitgeist.pm
        // wss://bp-rpc.zeitgeist.pm
        // const ZTGNET = "wss://bsr.zeitgeist.pm";
        const ZTGNET = "wss://roc.zeitgeist.pm";
        const sdk = await this.getDefaultSdk();

        // Generate signer based on seed
        const seed = 'maid ivory until crowd story liar ladder coil cricket example bulk extend'; // random seed
        const signer = util.signerFromSeed(seed);
        console.log("Sending transaction from", signer.address);

        // Construct Market metadata
        const description = "description for test";
        const slug = "test";
        const question = "Will this test work?";
        const categoriesMeta = [
            { name: "Yes", ticker: "YES" },
            { name: "No", ticker: "NO" },
        ];

        const metadata = {
            description,
            slug,
            question,
            categories: categoriesMeta,
        };

        const oracle = "5CS2Q1XbRR1eYnxeXUm8fqq6PfK3WLfwUvCpNvGsYAjKtsUC";
        const period = "1000000";
        const marketPeriod = {
            block: period.split(" ").map((x) => +x),
        };
        const mdm = { authorized: "1" };
        const creationType = "Advised";
        const scoringRule = "CPMM";
        const marketType = { Categorical: categoriesMeta.length };

        const params = {
            signer: signer,
            oracle: oracle,
            period: marketPeriod,
            metadata: metadata,
            creationType: creationType,
            marketType: marketType,
            disputeMechanism: mdm,
            scoringRule: scoringRule,
            callbackOrPaymentInfo: false,
        };

        const marketId = await sdk.models.createMarket(params);
        console.log(`Categorical market created! Market Id: ${marketId}`);
    }

    async createMarketPlayground() {
        const sdk = await this.getDefaultSdk();
        const res = await sdk.models.createCpmmMarketAndDeployAssets({
            signer: util.signerFromSeed(`//Alice`),
            oracle: `dE3pPiRvdKqPD5bUDBu3Xpi83McE3Zf3UG8CbhWBQfvUywd7U`,
            period: { block: [4000, 5000] },
            marketType: { categorical: 5 },
            metadata: {
                categories: [
                    { name: `karura` },
                    { name: `moonriver` },
                    { name: `phala` },
                    { name: `robonomics` },
                    { name: `kilt` },
                ],
                slug: `kusama-derby-example`,
                description: `example description`,
                question: `who will win?`,
            },
            mdm: { authorized: `dE3pPiRvdKqPD5bUDBu3Xpi83McE3Zf3UG8CbhWBQfvUywd7U` },
            swapFee: `1000000000`,
            amount: `10000000000`,
            weights: [
                `10000000000`,
                `10000000000`,
                `10000000000`,
                `10000000000`,
                `10000000000`,
            ],
            callbackOrPaymentInfo: false,
        });
        return res;
    }
}

const ztgManager = new ZeitgeistManager(websocketEndpoint);

// const market_123 = await ztgManager.queryMarket(123)
// console.log(market_123);
// console.log(await ztgManager.getMarketCount());

// const modelsDefault = await ztgManager.getModelsDefault()
// console.log(await modelsDefault.getAllMarketIds())
// console.log(await modelsDefault.createMarket())
// console.log(await getAllMarketIds.default({"endpoint" : websocketEndpoint}))

// ztgManager.getMarketCount()
//     .catch(console.error)
//     .finally(() => process.exit());

ztgManager.createCategoricalMarket2()
    .catch(console.error)
    .finally(() => process.exit());

// ztgManager.getMarketCount()
//     .catch(console.error)
//     .finally(() => process.exit());

// creation

const params =  {
        signer: "KeyringPairOrExtSigner",
        baseAsset: "string",
        oracle: "string",
        period: "MarketPeriod",
        deadlines: "MarketDeadlines",
        metadata: "DecodedMarketMetadata",
        creationType: "string",
        marketType: "MarketTypeOf",
        disputeMechanism: "string",
        scoringRule: "string",
        callbackOrPaymentInfo: false
}
// const newMarket = await modelsDefault.createMarket(params);


