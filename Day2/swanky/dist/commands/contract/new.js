"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewContract = void 0;
const core_1 = require("@oclif/core");
const path = require("node:path");
const fs_extra_1 = require("fs-extra");
const swanky_core_1 = require("@astar-network/swanky-core");
const swanky_templates_1 = require("@astar-network/swanky-templates");
const prompts_1 = require("../../lib/prompts");
const change_case_1 = require("change-case");
const execa = require("execa");
const inquirer = require("inquirer");
class NewContract extends core_1.Command {
    async run() {
        await (0, swanky_core_1.ensureSwankyProject)();
        const config = await (0, swanky_core_1.getSwankyConfig)();
        const projectPath = path.resolve();
        const { args, flags } = await this.parse(NewContract);
        if ((0, fs_extra_1.pathExistsSync)(path.join(projectPath, "contracts", args.contractName)) ||
            config.contracts[args.contractName]) {
            throw new Error(`Contract folder '${args.contractName}' already exists`);
        }
        const { contractLanguage } = flags.language
            ? { contractLanguage: flags.language }
            : await inquirer.prompt([(0, prompts_1.pickLanguage)()]);
        const templates = (0, swanky_templates_1.getTemplates)(contractLanguage);
        const { contractTemplate } = flags.template
            ? { contractTemplate: flags.template }
            : await inquirer.prompt([(0, prompts_1.pickTemplate)(templates.contractTemplatesQueryPairs)]);
        // passing language and template by flags can result in a non-existing combination
        if (!templates.contractTemplateNames.includes(contractTemplate)) {
            this.error(`Selected template [${contractLanguage}] does not exist for selected language [${contractLanguage}]`);
        }
        const questions = [
            (0, prompts_1.name)("author", () => execa.commandSync("git config --get user.name").stdout, "What is your name?"),
            (0, prompts_1.email)(),
        ];
        const answers = await inquirer.prompt(questions);
        const spinner = new swanky_core_1.Spinner(flags.verbose);
        await spinner.runCommand(() => (0, swanky_core_1.checkCliDependencies)(spinner), "Checking dependencies");
        await spinner.runCommand(() => (0, swanky_core_1.copyContractTemplateFiles)(path.resolve(templates.contractTemplatesPath, contractTemplate), args.contractName, projectPath), "Copying contract template files");
        await spinner.runCommand(() => (0, swanky_core_1.processTemplates)(projectPath, {
            project_name: (0, change_case_1.paramCase)(this.config.pjson.name),
            author_name: answers.authorName,
            author_email: answers.email,
            swanky_version: this.config.pjson.version,
            contract_name: args.contractName,
            contract_name_snake: (0, change_case_1.snakeCase)(args.contractName),
            contract_name_pascal: (0, change_case_1.pascalCase)(args.contractName),
            contract_language: contractLanguage,
        }), "Processing contract templates");
        await (0, fs_extra_1.ensureDir)(path.resolve(projectPath, "artifacts", args.contractName));
        await (0, fs_extra_1.ensureDir)(path.resolve(projectPath, "test", args.contractName));
        if (contractLanguage === "ask") {
            await spinner.runCommand(async () => {
                const pjson = await (0, fs_extra_1.readJSON)("package.json");
                const deps = Object.keys(pjson.dependencies || {});
                if (!deps.includes("ask-lang")) {
                    await execa.command("yarn add ask-lang");
                    await execa.command("yarn add ask-transform assemblyscript@0.19 -D");
                }
            }, "Installing Ask!");
        }
        await spinner.runCommand(async () => {
            config.contracts[args.contractName] = {
                name: args.contractName,
                language: contractLanguage,
                deployments: [],
            };
            await (0, fs_extra_1.writeJSON)(path.resolve("swanky.config.json"), config, { spaces: 2 });
        }, "Writing config");
        this.log("😎 New contract successfully generated! 😎");
    }
}
exports.NewContract = NewContract;
NewContract.description = "Generate a new smart contract template inside a project";
NewContract.flags = {
    template: core_1.Flags.string({
        options: (0, swanky_templates_1.getAllTemplateNames)(),
    }),
    language: core_1.Flags.string({
        options: ["ink", "ask"],
        char: "l",
        required: false,
    }),
    verbose: core_1.Flags.boolean({ char: "v" }),
};
NewContract.args = [
    {
        name: "contractName",
        required: true,
        description: "Name of new contract",
    },
];
