"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileContract = void 0;
const core_1 = require("@oclif/core");
const path = require("node:path");
const node_fs_1 = require("node:fs");
const swanky_core_1 = require("@astar-network/swanky-core");
const fs_extra_1 = require("fs-extra");
class CompileContract extends core_1.Command {
    async run() {
        const { args, flags } = await this.parse(CompileContract);
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
        // await execa.command("npx typechain-compiler");
        await spinner.runCommand(async () => {
            return new Promise((resolve, reject) => {
                const build = (0, swanky_core_1.getBuildCommandFor)(contractInfo.language, contractPath);
                build.stdout.on("data", () => spinner.ora.clear());
                build.stdout.pipe(process.stdout);
                if (flags.verbose) {
                    build.stderr.on("data", () => spinner.ora.clear());
                    build.stderr.pipe(process.stdout);
                }
                build.on("error", (error) => {
                    reject(error);
                });
                build.on("exit", () => {
                    resolve();
                });
            });
        }, "Compiling contract", "Contract compiled successfully");
        const buildData = (await spinner.runCommand(async () => {
            return (0, swanky_core_1.copyArtifactsFor)(contractInfo.language, contractInfo.name, contractPath);
        }, "Copying artifacts"));
        // if (contractInfo.language === "ask") {
        //   await spinner.runCommand(async () => {
        //     const testPath = path.resolve(`test/${args.contractName}`);
        //     await generateTypes(buildData.artifactsPath, testPath);
        //   }, "Generating types");
        // }
        await spinner.runCommand(async () => {
            contractInfo.build = buildData;
            await (0, fs_extra_1.writeJSON)(path.resolve("swanky.config.json"), config, {
                spaces: 2,
            });
        }, "Writing config");
    }
}
exports.CompileContract = CompileContract;
CompileContract.description = "Compile the smart contract(s) in your contracts directory";
CompileContract.flags = {
    verbose: core_1.Flags.boolean({
        default: false,
        char: "v",
        description: "Display additional compilation output",
    }),
};
CompileContract.args = [
    {
        name: "contractName",
        required: true,
        description: "Name of the contract to compile",
    },
];
