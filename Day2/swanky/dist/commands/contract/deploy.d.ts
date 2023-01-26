import { Command } from "@oclif/core";
export declare class DeployContract extends Command {
    static description: string;
    static flags: {
        account: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        gas: import("@oclif/core/lib/interfaces").OptionFlag<number>;
        args: import("@oclif/core/lib/interfaces").OptionFlag<string[] | undefined>;
        network: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    run(): Promise<void>;
}
