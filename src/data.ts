import {Command} from "commander"
import {index, validate} from "./commands"
import output from "./output"

const program = new Command

program.name("data")
program.description("Work with the warmachine data files")
program.version("0.0.1")
program.showHelpAfterError()

program.configureOutput({
	outputError: (str, write) => write(output.error(str))
});

program.command("validate")
	.description("Validate one or more data files")
	.argument("[dataset]", "Which dataset do you want to validate? Eg. abilities", "all")
	.action(validate(program))

program.command("index")
	.description("Build the index.json file based on the available data files.")
	.action(index(program))

program.parse()
