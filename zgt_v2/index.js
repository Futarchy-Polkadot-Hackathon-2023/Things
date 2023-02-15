import {create, mainnet, batterystation, ZTG, swapFeeFromFloat} from "@zeitgeistpm/sdk";
import { IPFS } from "@zeitgeistpm/web3.storage";
import { Keyring } from "@polkadot/keyring";
import {cryptoWaitReady} from  "@polkadot/util-crypto"
import * as dotenv from 'dotenv';
// import {MarketGetQuery} from "@zeitgeistpm/sdk/dist/model/markets/functions/get/types";
dotenv.config()

class ZtgManager {
    async getSdk() {
        return await create(batterystation());
        //return await create(mainnet());

        // const sdk = await create({
        //     provider: "wss://bsr.zeitgeist.pm",
        //     storage: createStorage(
        //         IPFS.storage({
        //             node: { url: "localhost:5001" },
        //         })
        //     ),
        // });

    }

    async getMarket(marketId) {
        const sdk = await this.getSdk();
        return await sdk.model.markets.get(marketId);
    }

    async getAllMarketIds() {
        const sdk = await this.getSdk();
        return await sdk.model.markets.get();
    }

    async createMarket() {
        const sdk = await this.getSdk();
        const seed = process.env.seed;


        await cryptoWaitReady()

        const keyring = new Keyring({ ss58Format: 73, type: 'sr25519' }) // battery station, zeitgeist testnet format
        const keypair = keyring.addFromMnemonic(process.env.seed) // 12 word
        const signer = keypair

        // const signer = util.signerFromSeed(seed);

        const params = {
            baseAsset: { Ztg: null },
            signer,
            disputeMechanism: "Authorized",
            marketType: { Categorical: 2 },
            oracle: signer.address,
            period: { Timestamp: [Date.now(), Date.now() + 60 * 60 * 24 * 1000 * 2] },
            deadlines: {
                disputeDuration: 5000,
                gracePeriod: 200,
                oracleDuration: 500,
            },
            metadata: {
                __meta: "markets",
                question: "Will the 3rd example work?",
                description: "Testing the sdk.",
                slug: "standalone-market-example",
                categories: [
                    { name: "yes", ticker: "Y" },
                    { name: "no", ticker: "N" },
                ],
                tags: ["dev"],
            },
            pool: {
                amount: ZTG.mul(100).toString(),
                swapFee: swapFeeFromFloat(1).toString(),
                weights: ["50000000000", "50000000000"],
            },
        };

        const response = await sdk.model.markets.create(params);
        // extracts the market and pool creation events from block
        const { market, pool } = response.saturate().unwrap();

        console.log(`Market created with id: ${market.marketId}`);
        console.log(`Pool created with id: ${pool.poolId}`);
        console.log(response);
    }
}




// console.log((await create(mainnet())).api.consts.swaps.minLiquidity.toNumber()) // 1000000000000



const manager = new ZtgManager();

// manager.getAllMarketIds()
//     .then(console.log)
//     .catch(console.error)
//     .finally(() => process.exit());
manager.createMarket()
    .then(console.log)
    .catch(console.error)
    .finally(() => process.exit());

