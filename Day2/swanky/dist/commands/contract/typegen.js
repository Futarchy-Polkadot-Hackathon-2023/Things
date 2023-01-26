"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileContract = void 0;
const core_1 = require("@oclif/core");
const path = require("node:path");
const node_fs_1 = require("node:fs");
const swanky_core_1 = require("@astar-network/swanky-core");
class CompileContract extends core_1.Command {
    async run() {
        const { args } = await this.parse(CompileContract);
        await (0, swanky_core_1.ensureSwankyProject)();
        const config = await (0, swanky_core_1.getSwankyConfig)();
        const contractInfo = config.contracts[args.contractName];
        if (!contractInfo) {
            this.error(`Cannot find a contract named ${args.contractName} in swanky.config.json`);
        }
        const spinner = new swanky_core_1.Spinner();
        const contractList = (0, node_fs_1.readdirSync)(path.resolve("contracts"));
        const contractPath = path.resolve("contracts", args.contractName);
        if (!contractList.includes(args.contractName)) {
            this.error(`Path to contract ${args.contractName} does not exist: ${contractPath}`);
        }
        const testPath = path.resolve(`test/${args.contractName}`);
        if (!contractInfo.build) {
            this.error(`No build data for contract "${args.contractName}"`);
        }
        await spinner.runCommand(async () => {
            // @ts-ignore
            await (0, swanky_core_1.generateTypes)(contractInfo.build.artifactsPath, testPath);
        }, "Generating types");
    }
}
exports.CompileContract = CompileContract;
CompileContract.description = "Generate types from compiled contract metadata";
CompileContract.args = [
    {
        name: "contractName",
        required: true,
        description: "Name of the contract",
    },
];
