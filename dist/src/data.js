"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const commands_1 = require("./commands");
const output_1 = __importDefault(require("./output"));
const program = new commander_1.Command;
program.name("data");
program.description("Work with the warmachine data files");
program.version("0.0.1");
program.showHelpAfterError();
program.configureOutput({
    outputError: (str, write) => write(output_1.default.error(str))
});
program.command("validate")
    .description("Validate one or more data files")
    .argument("[dataset]", "Which dataset do you want to validate? Eg. abilities", "all")
    .action((0, commands_1.validate)(program));
program.command("index")
    .description("Build the index.json file based on the available data files.")
    .action((0, commands_1.build)(program));
program.parse();
