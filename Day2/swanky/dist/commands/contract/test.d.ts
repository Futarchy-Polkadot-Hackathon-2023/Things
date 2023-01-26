import { Command } from "@oclif/core";
declare global {
    var contractTypesPath: string;
}
export declare class CompileContract extends Command {
    static description: string;
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    run(): Promise<void>;
}
