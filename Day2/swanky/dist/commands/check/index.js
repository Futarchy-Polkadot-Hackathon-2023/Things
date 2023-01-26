"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const listr2_1 = require("listr2");
const swanky_core_1 = require("@astar-network/swanky-core");
const fs = require("fs-extra");
const path = require("node:path");
const toml = require("toml");
const semver = require("semver");
class Check extends core_1.Command {
    async run() {
        await (0, swanky_core_1.ensureSwankyProject)();
        const tasks = new listr2_1.Listr([
            {
                title: "Check Rust",
                task: async (ctx) => {
                    ctx.versions.tools.rust = await (0, swanky_core_1.commandStdoutOrNull)("rustc --version");
                },
            },
            {
                title: "Check cargo",
                task: async (ctx) => {
                    ctx.versions.tools.cargo = await (0, swanky_core_1.commandStdoutOrNull)("cargo -V");
                },
            },
            {
                title: "Check cargo nightly",
                task: async (ctx) => {
                    ctx.versions.tools.cargoNightly = await (0, swanky_core_1.commandStdoutOrNull)("cargo +nightly -V");
                },
            },
            {
                title: "Check cargo dylint",
                task: async (ctx) => {
                    ctx.versions.tools.cargoDylint = await (0, swanky_core_1.commandStdoutOrNull)("cargo dylint -V");
                },
            },
            {
                title: "Check cargo-contract",
                task: async (ctx) => {
                    ctx.versions.tools.cargoContract = await (0, swanky_core_1.commandStdoutOrNull)("cargo contract -V");
                },
            },
            {
                title: "Read ink dependencies",
                task: async (ctx) => {
                    const swankyConfig = await fs.readJSON("swanky.config.json");
                    ctx.swankyConfig = swankyConfig;
                    const contractInkVersions = {};
                    for (const contract in swankyConfig.contracts) {
                        const tomlPath = path.resolve(`contracts/${contract}/Cargo.toml`);
                        const doesCargoTomlExist = fs.pathExistsSync(tomlPath);
                        if (!doesCargoTomlExist) {
                            contractInkVersions[contract] = null;
                            continue;
                        }
                        const cargoTomlString = fs.readFileSync(tomlPath, {
                            encoding: "utf8",
                        });
                        const cargoToml = toml.parse(cargoTomlString);
                        const inkDependencies = Object.entries(cargoToml.dependencies)
                            .filter((dependency) => dependency[0].includes("ink_"))
                            .map(([depName, depInfo]) => {
                            const dependency = depInfo;
                            return [depName, dependency.version || dependency.tag];
                        });
                        ctx.versions.contracts[contract] = Object.fromEntries(inkDependencies);
                    }
                },
            },
            {
                title: "Verify ink version",
                task: async (ctx) => {
                    const supportedInk = ctx.swankyConfig?.node.supportedInk;
                    const mismatched = {};
                    Object.entries(ctx.versions.contracts).forEach(([contract, inkPackages]) => {
                        Object.entries(inkPackages).forEach(([inkPackage, version]) => {
                            if (semver.gt(version, supportedInk)) {
                                mismatched[`${contract}-${inkPackage}`] = `Version of ${inkPackage} (${version}) in ${contract} is higher than supported ink version (${supportedInk})`;
                            }
                            if (!(version.charAt(0) === "=" || version.charAt(0) === "v")) {
                                ctx.looseDefinitionDetected = true;
                            }
                        });
                    });
                    ctx.mismatchedVersions = mismatched;
                },
            },
        ]);
        const context = await tasks.run({
            versions: { tools: {}, contracts: {} },
            looseDefinitionDetected: false,
        });
        console.log(context.versions);
        Object.values(context.mismatchedVersions).forEach((mismatch) => console.error(`[ERROR] ${mismatch}`));
        if (context.looseDefinitionDetected) {
            console.log(`\n[WARNING]Some of the ink dependencies do not have a fixed version.
      This can lead to accidentally installing version higher than supported by the node.
      Please use "=" to install a fixed version (Example: "=3.0.1")
      `);
        }
    }
}
exports.default = Check;
Check.description = "Check installed package versions and compatibility";
Check.flags = {};
Check.args = [];
