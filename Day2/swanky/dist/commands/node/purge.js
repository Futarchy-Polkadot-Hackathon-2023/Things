"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurgeNode = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const execa_1 = tslib_1.__importDefault(require("execa"));
const swanky_core_1 = require("@astar-network/swanky-core");
class PurgeNode extends core_1.Command {
    async run() {
        (0, swanky_core_1.ensureSwankyProject)();
        const config = await (0, swanky_core_1.getSwankyConfig)();
        await execa_1.default.command(`${config.node.localPath} purge-chain`, {
            stdio: "inherit",
        });
        this.log("Purged chain state");
    }
}
exports.PurgeNode = PurgeNode;
PurgeNode.description = "Purge local chain state";
PurgeNode.flags = {};
PurgeNode.args = [];
