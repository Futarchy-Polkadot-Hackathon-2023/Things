"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileContract = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const path = require("node:path");
const node_fs_1 = require("node:fs");
const swanky_core_1 = require("@astar-network/swanky-core");
const globby_1 = tslib_1.__importDefault(require("globby"));
const mocha_1 = tslib_1.__importDefault(require("mocha"));
const fs_extra_1 = require("fs-extra");
class CompileContract extends core_1.Command {
    async run() {
        const { args } = await this.parse(CompileContract);
        await (0, swanky_core_1.ensureSwankyProject)();
        const config = await (0, swanky_core_1.getSwankyConfig)();
        const contractInfo = config.contracts[args.contractName];
        if (!contractInfo) {
            this.error(`Cannot find a contract named ${args.contractName} in swanky.config.json`);
        }
        const contractList = (0, node_fs_1.readdirSync)(path.resolve("contracts"));
        const contractPath = path.resolve("contracts", args.contractName);
        if (!contractList.includes(args.contractName)) {
            this.error(`Path to contract ${args.contractName} does not exist: ${contractPath}`);
        }
        if (!contractInfo.build) {
            this.error(`Cannot find build data for ${args.contractName} contract in swanky.config.json`);
        }
        const buildData = contractInfo.build;
        const reportDir = path.resolve(buildData.artifactsPath, "testReports", Date.now().toString());
        await (0, fs_extra_1.ensureDir)(reportDir);
        const mocha = new mocha_1.default({
            timeout: 200000,
            reporter: "mochawesome",
            reporterOptions: {
                reportDir,
                charts: true,
                reportTitle: `${args.contractName} test report`,
                quiet: true,
                json: false,
            },
        });
        const tests = await (0, globby_1.default)(`${path.resolve("test", args.contractName)}/*.test.ts`);
        mocha.addFile;
        tests.forEach((test) => {
            mocha.addFile(test);
        });
        global.contractTypesPath = path.resolve("test", args.contractName, "typedContract");
        mocha.run((failures) => {
            if (failures) {
                this.error(`At least one of the tests failed. Check report for details: ${reportDir}`);
            }
            else {
                this.log(`All tests passing. Check the report for details: ${reportDir}`);
            }
        });
    }
}
exports.CompileContract = CompileContract;
CompileContract.description = "Run tests for a given contact";
CompileContract.args = [
    {
        name: "contractName",
        required: true,
        description: "Name of the contract to compile",
    },
];
