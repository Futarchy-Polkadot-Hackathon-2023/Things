"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccount = void 0;
const core_1 = require("@oclif/core");
const chalk = require("chalk");
const swanky_core_1 = require("@astar-network/swanky-core");
class CreateAccount extends core_1.Command {
    async run() {
        await (0, swanky_core_1.ensureSwankyProject)();
        const config = await (0, swanky_core_1.getSwankyConfig)();
        this.log(`${chalk.greenBright("✔")} Stored dev accounts:`);
        config.accounts.forEach((account) => {
            this.log(`\t${chalk.yellowBright("Alias: ")} ${account.alias}`);
        });
    }
}
exports.CreateAccount = CreateAccount;
CreateAccount.description = "List dev accounts stored in config";
CreateAccount.aliases = [`account:ls`];
