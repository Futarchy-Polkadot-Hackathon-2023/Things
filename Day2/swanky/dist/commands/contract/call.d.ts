import { Command } from "@oclif/core";
export declare class CallContract extends Command {
    static description: string;
    static flags: {
        args: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        contractName: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        message: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        dry: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        gas: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        network: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        deploymentTimestamp: import("@oclif/core/lib/interfaces").OptionFlag<number | undefined>;
    };
    static args: never[];
    run(): Promise<void>;
}
