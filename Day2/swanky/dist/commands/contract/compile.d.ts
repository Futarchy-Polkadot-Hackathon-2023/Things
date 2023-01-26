import { Command } from "@oclif/core";
export declare class CompileContract extends Command {
    static description: string;
    static flags: {
        verbose: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    run(): Promise<void>;
}
