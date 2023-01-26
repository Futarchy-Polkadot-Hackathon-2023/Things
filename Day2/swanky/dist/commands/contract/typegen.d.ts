import { Command } from "@oclif/core";
export declare class CompileContract extends Command {
    static description: string;
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    run(): Promise<void>;
}
