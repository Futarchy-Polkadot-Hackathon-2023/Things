import { Command } from "@oclif/core";
export declare class Init extends Command {
    static description: string;
    static flags: {
        "swanky-node": import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        template: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        language: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        verbose: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    run(): Promise<void>;
}
