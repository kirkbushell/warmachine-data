import {Command} from 'commander'
import command from "./command";

const program = new Command

program
	.name('validate')
	.description('Validate warmachine data files')
	.version('0.0.1')
	.argument('<dataset>', 'Which dataset do you want to validate? Eg. abilities')
	.action(command(program))

program.showHelpAfterError()
program.parse()
