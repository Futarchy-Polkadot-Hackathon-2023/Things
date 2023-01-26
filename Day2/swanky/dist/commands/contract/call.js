"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallContract = void 0;
const core_1 = require("@oclif/core");
const node_child_process_1 = require("node:child_process");
const path = require("node:path");
const swanky_core_1 = require("@astar-network/swanky-core");
class CallContract extends core_1.Command {
    async run() {
        const { flags } = await this.parse(CallContract);
        const config = await (0, swanky_core_1.getSwankyConfig)();
        const contractInfo = config.contracts[flags.contractName];
        if (!contractInfo) {
            this.error(`Cannot find a contract named ${flags.contractName} in swanky.config.json`);
        }
        const deploymentData = flags.deploymentTimestamp
            ? contractInfo.deployments.find((deployment) => deployment.timestamp === flags.deploymentTimestamp)
            : contractInfo.deployments[0];
        if (!deploymentData?.address)
            throw new Error(`Deployment with timestamp ${deploymentData?.timestamp} has no deployment address!`);
        (0, node_child_process_1.execSync)(`cargo contract call --contract ${deploymentData.address} --message ${flags.message} ${flags.args ? "--args " + flags.args : ""} --suri //Alice --gas ${flags.gas ?? "100000000000"} --url ${(0, swanky_core_1.resolveNetworkUrl)(config, flags.network ?? "")} ${flags.dry ? "--dry-run" : ""}`, {
            stdio: "inherit",
            cwd: path.resolve("contracts", contractInfo?.name ?? ""),
        });
    }
}
exports.CallContract = CallContract;
CallContract.description = "Call a method on a smart contract";
CallContract.flags = {
    args: core_1.Flags.string({
        required: false,
        char: "a",
    }),
    contractName: core_1.Flags.string({
        required: true,
    }),
    message: core_1.Flags.string({
        required: true,
        char: "m",
    }),
    dry: core_1.Flags.boolean({
        char: "d",
    }),
    gas: core_1.Flags.string({
        char: "g",
    }),
    network: core_1.Flags.string({
        char: "n",
        description: "Network name to connect to",
    }),
    deploymentTimestamp: core_1.Flags.integer({
        char: "t",
        required: false,
        description: "Specific deployment to target",
    }),
};
CallContract.args = [];
