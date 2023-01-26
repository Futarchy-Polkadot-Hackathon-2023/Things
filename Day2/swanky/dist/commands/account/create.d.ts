import { Command } from "@oclif/core";
export declare class CreateAccount extends Command {
    static description: string;
    static flags: {
        generate: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        dev: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: never[];
    run(): Promise<void>;
}
