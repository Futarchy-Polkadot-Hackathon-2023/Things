import { Command } from "@oclif/core";
export declare class StartNode extends Command {
    static description: string;
    static flags: {
        tmp: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: never[];
    run(): Promise<void>;
}
