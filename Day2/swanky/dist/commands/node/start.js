"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartNode = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const execa_1 = tslib_1.__importDefault(require("execa"));
const swanky_core_1 = require("@astar-network/swanky-core");
class StartNode extends core_1.Command {
    async run() {
        (0, swanky_core_1.ensureSwankyProject)();
        const { flags } = await this.parse(StartNode);
        const config = await (0, swanky_core_1.getSwankyConfig)();
        // run persistent mode by default. non-persistent mode in case flag is provided.
        await execa_1.default.command(`${config.node.localPath} \
      --rpc-cors http://localhost:*,http://127.0.0.1:*,https://localhost:*,https://127.0.0.1:*,https://polkadot.js.org,https://contracts-ui.substrate.io/ \
      ${flags.tmp ? "--dev" : ""}`, {
            stdio: "inherit",
        });
        this.log("Node started");
    }
}
exports.StartNode = StartNode;
StartNode.description = "Start a local node";
StartNode.flags = {
    tmp: core_1.Flags.boolean({
        char: "t",
        description: "Run node with non-persistent mode",
    }),
};
StartNode.args = [];
