// import abilities from "../data/abilities.json"
// import spells from "../data/spells.json"
import {Ability} from "./schemas"
import {Command} from 'commander'

const program = new Command

program
	.name('validate')
	.description('Validate warmachine data files')
	.version('0.0.1')
	.argument('<dataset>', 'Which dataset do you want to validate? Eg. abilities')
	.action(async (dataset: string) => {
		const abilities = await import(`../data/${dataset}.json`)
		
		for (const [id, value] of Object.entries(abilities.default)) {
			Ability.parse(value)
		}
	})

program.showHelpAfterError()
program.parse()

