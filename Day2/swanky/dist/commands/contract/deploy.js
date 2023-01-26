"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployContract = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const path = require("node:path");
const fs_extra_1 = require("fs-extra");
const util_crypto_1 = require("@polkadot/util-crypto");
const swanky_core_1 = require("@astar-network/swanky-core");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const chalk = require("chalk");
class DeployContract extends core_1.Command {
    async run() {
        await (0, swanky_core_1.ensureSwankyProject)();
        const { args, flags } = await this.parse(DeployContract);
        const config = await (0, swanky_core_1.getSwankyConfig)();
        const spinner = new swanky_core_1.Spinner();
        const contractInfo = config.contracts[args.contractName];
        if (!contractInfo) {
            this.error(`Cannot find a contract named ${args.contractName} in swanky.config.json`);
        }
        const accountData = config.accounts.find((account) => account.alias === flags.account);
        if (!accountData) {
            this.error("Provided account alias not found in swanky.config.json");
        }
        const mnemonic = accountData.isDev
            ? accountData.mnemonic
            : (0, swanky_core_1.decrypt)(accountData.mnemonic, (await inquirer_1.default.prompt([
                {
                    type: "password",
                    message: `Enter password for ${chalk.yellowBright(accountData.alias)}: `,
                    name: "password",
                },
            ])).password);
        const account = (await spinner.runCommand(async () => {
            await (0, util_crypto_1.cryptoWaitReady)();
            return new swanky_core_1.ChainAccount(mnemonic);
        }, "Initialising"));
        const { abi, wasm } = (await spinner.runCommand(async () => {
            if (!contractInfo.build) {
                this.error(`No build info found for contract named ${args.contractName}`);
            }
            const abi = (await (0, fs_extra_1.readJSON)(path.resolve(contractInfo.build.artifactsPath, `${args.contractName}.json`)));
            let wasm;
            if (contractInfo.language === "ask") {
                wasm = await (0, fs_extra_1.readFile)(path.resolve(contractInfo.build.artifactsPath, `${args.contractName}.wasm`));
            }
            else {
                const contract = await (0, fs_extra_1.readJSON)(path.resolve(contractInfo.build.artifactsPath, `${args.contractName}.wasm`));
                wasm = contract.source.wasm;
            }
            return { abi, wasm };
        }, "Getting WASM"));
        const networkUrl = (0, swanky_core_1.resolveNetworkUrl)(config, flags.network ?? "");
        const api = (await spinner.runCommand(async () => {
            const api = new swanky_core_1.DeployApi(networkUrl);
            await api.start();
            return api;
        }, "Connecting to node"));
        const contractAddress = (await spinner.runCommand(async () => {
            try {
                const contractAddress = await api.deploy(abi, wasm, account.pair, flags.gas, flags.args);
                return contractAddress;
            }
            catch (e) {
                console.error(e);
                throw new Error("Error deploying!");
            }
        }, "Deploying"));
        await spinner.runCommand(async () => {
            contractInfo.deployments = [
                ...contractInfo.deployments,
                {
                    timestamp: Date.now(),
                    address: contractAddress,
                    networkUrl,
                    deployerAlias: flags.account,
                },
            ];
            await (0, fs_extra_1.writeJSON)(path.resolve("swanky.config.json"), config, {
                spaces: 2,
            });
        }, "Writing config");
        this.log(`Contract deployed!`);
        this.log(`Contract address: ${contractAddress}`);
    }
}
exports.DeployContract = DeployContract;
DeployContract.description = "Deploy contract to a running node";
DeployContract.flags = {
    account: core_1.Flags.string({
        required: true,
        description: "Alias of account to be used",
    }),
    gas: core_1.Flags.integer({
        required: true,
        char: "g",
    }),
    args: core_1.Flags.string({
        char: "a",
        multiple: true,
    }),
    network: core_1.Flags.string({
        char: "n",
        description: "Network name to connect to",
    }),
};
DeployContract.args = [
    {
        name: "contractName",
        required: true,
        description: "Name of the contract to deploy",
    },
];
