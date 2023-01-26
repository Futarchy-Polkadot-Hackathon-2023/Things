"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init = void 0;
const core_1 = require("@oclif/core");
const path = require("node:path");
const fs_extra_1 = require("fs-extra");
const execa = require("execa");
const change_case_1 = require("change-case");
const inquirer = require("inquirer");
const prompts_1 = require("../../lib/prompts");
const swanky_core_1 = require("@astar-network/swanky-core");
const swanky_templates_1 = require("@astar-network/swanky-templates");
const { DEFAULT_ASTAR_NETWORK_URL, DEFAULT_NETWORK_URL, DEFAULT_SHIBUYA_NETWORK_URL, DEFAULT_SHIDEN_NETWORK_URL, } = swanky_core_1.consts;
class Init extends core_1.Command {
    async run() {
        const { args, flags } = await this.parse(Init);
        const projectPath = path.resolve(args.projectName);
        const { contractLanguage } = await inquirer.prompt([(0, prompts_1.pickLanguage)()]);
        const templates = (0, swanky_templates_1.getTemplates)(contractLanguage);
        const questions = [
            (0, prompts_1.pickTemplate)(templates.contractTemplatesQueryPairs),
            (0, prompts_1.name)("contract", (ans) => ans.contractTemplate, "What should we name your initial contract?"),
            (0, prompts_1.name)("author", () => execa.commandSync("git config --get user.name").stdout, "What is your name?"),
            (0, prompts_1.email)(),
        ];
        if (!flags["swanky-node"]) {
            questions.push((0, prompts_1.choice)("useSwankyNode", "Do you want to download Swanky node?"));
        }
        const answers = await inquirer.prompt(questions);
        const spinner = new swanky_core_1.Spinner(flags.verbose);
        await spinner.runCommand(() => (0, swanky_core_1.checkCliDependencies)(spinner), "Checking dependencies");
        await spinner.runCommand(() => (0, swanky_core_1.copyTemplateFiles)(templates.templatesPath, path.resolve(templates.contractTemplatesPath, answers.contractTemplate), answers.contractName, projectPath), "Copying template files");
        await spinner.runCommand(() => (0, swanky_core_1.processTemplates)(projectPath, {
            project_name: (0, change_case_1.paramCase)(args.projectName),
            author_name: answers.authorName,
            author_email: answers.email,
            swanky_version: this.config.pjson.version,
            contract_name: answers.contractName,
            contract_name_snake: (0, change_case_1.snakeCase)(answers.contractName),
            contract_name_pascal: (0, change_case_1.pascalCase)(answers.contractName),
            contract_language: contractLanguage,
        }), "Processing templates");
        await spinner.runCommand(() => execa.command("git init", { cwd: projectPath }), "Initializing git");
        let nodePath = "";
        if (flags["swanky-node"] || answers.useSwankyNode) {
            const taskResult = (await spinner.runCommand(() => (0, swanky_core_1.downloadNode)(projectPath, swanky_core_1.swankyNode, spinner), "Downloading Swanky node"));
            nodePath = taskResult;
        }
        await (0, fs_extra_1.ensureDir)(path.resolve(projectPath, "artifacts", answers.contractName));
        await (0, fs_extra_1.ensureDir)(path.resolve(projectPath, "test", answers.contractName));
        await spinner.runCommand(() => (0, swanky_core_1.installDeps)(projectPath), "Installing dependencies", "", "", false);
        const config = {
            node: {
                localPath: nodePath,
                polkadotPalletVersions: swanky_core_1.swankyNode.polkadotPalletVersions,
                supportedInk: swanky_core_1.swankyNode.supportedInk,
            },
            accounts: [
                {
                    alias: "alice",
                    mnemonic: "//Alice",
                    isDev: true,
                    address: new swanky_core_1.ChainAccount("//Alice").pair.address,
                },
                {
                    alias: "bob",
                    mnemonic: "//Bob",
                    isDev: true,
                    address: new swanky_core_1.ChainAccount("//Bob").pair.address,
                },
            ],
            contracts: {
                [answers.contractName]: {
                    name: answers.contractName,
                    deployments: [],
                    language: contractLanguage,
                },
            },
            networks: {
                local: { url: DEFAULT_NETWORK_URL },
                astar: { url: DEFAULT_ASTAR_NETWORK_URL },
                shiden: { url: DEFAULT_SHIDEN_NETWORK_URL },
                shibuya: { url: DEFAULT_SHIBUYA_NETWORK_URL },
            },
        };
        await spinner.runCommand(() => (0, fs_extra_1.writeJSON)(path.resolve(projectPath, "swanky.config.json"), config, { spaces: 2 }), "Writing config");
        this.log("🎉 😎 Swanky project successfully initialised! 😎 🎉");
    }
}
exports.Init = Init;
Init.description = "Generate a new smart contract environment";
Init.flags = {
    "swanky-node": core_1.Flags.boolean(),
    template: core_1.Flags.string({
        options: (0, swanky_templates_1.getAllTemplateNames)(),
        char: "t",
    }),
    language: core_1.Flags.string({ options: ["ask", "ink"], char: "l" }),
    verbose: core_1.Flags.boolean({ char: "v" }),
};
Init.args = [
    {
        name: "projectName",
        required: true,
        description: "directory name of new project",
    },
];
