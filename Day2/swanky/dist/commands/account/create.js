"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccount = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const chalk = require("chalk");
const fs_extra_1 = require("fs-extra");
const swanky_core_1 = require("@astar-network/swanky-core");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
class CreateAccount extends core_1.Command {
    async run() {
        await (0, swanky_core_1.ensureSwankyProject)();
        const { flags } = await this.parse(CreateAccount);
        const isDev = flags.dev ??
            (await inquirer_1.default.prompt([
                { type: "confirm", message: "Is this a DEV account? ", name: "isDev", default: false },
            ])).isDev;
        if (isDev) {
            console.log(`${chalk.redBright("DEV account mnemonic will be stored in plain text. DO NOT USE IN PROD!")}`);
        }
        let tmpMnemonic = "";
        if (flags.generate) {
            tmpMnemonic = swanky_core_1.ChainAccount.generate();
            console.log(`${isDev
                ? ""
                : chalk.yellowBright("This is your mnemonic. Copy it to a secure place, as it will be encrypted and not accessible anymore.")}
        ${"-".repeat(tmpMnemonic.length)}
        ${tmpMnemonic}
        ${"-".repeat(tmpMnemonic.length)}`);
        }
        else {
            tmpMnemonic = (await inquirer_1.default.prompt([{ type: "input", message: "Enter mnemonic: ", name: "mnemonic" }])).mnemonic;
        }
        const accountData = {
            mnemonic: "",
            isDev,
            alias: (await inquirer_1.default.prompt([{ type: "input", message: "Enter alias: ", name: "alias" }]))
                .alias,
            address: new swanky_core_1.ChainAccount(tmpMnemonic).pair.address,
        };
        if (!isDev) {
            const password = (await inquirer_1.default.prompt([
                { type: "password", message: "Enter encryption password: ", name: "password" },
            ])).password;
            accountData.mnemonic = (0, swanky_core_1.encrypt)(tmpMnemonic, password);
        }
        else {
            accountData.mnemonic = tmpMnemonic;
        }
        const config = await (0, swanky_core_1.getSwankyConfig)();
        config.accounts.push(accountData);
        await (0, fs_extra_1.writeJSON)("swanky.config.json", config, { spaces: 2 });
        this.log(`${chalk.greenBright("✔")} Account with alias ${chalk.yellowBright(accountData.alias)} stored to config`);
    }
}
exports.CreateAccount = CreateAccount;
CreateAccount.description = "Create a new dev account in config";
CreateAccount.flags = {
    generate: core_1.Flags.boolean({
        char: "g",
    }),
    dev: core_1.Flags.boolean({
        char: "d",
    }),
};
CreateAccount.args = [];
