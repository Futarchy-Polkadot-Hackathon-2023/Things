import { Command } from "@oclif/core";
export default class Check extends Command {
    static description: string;
    static flags: {};
    static args: never[];
    run(): Promise<void>;
}
