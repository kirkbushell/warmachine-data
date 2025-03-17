import {Ability, Spell} from "./schemas"
import {ZodObject} from "zod";
import {Command} from "commander";

const schemas: { [key: string]: ZodObject<any> } = {
	"abilities": Ability,
	"spells": Spell
}

export default (program: Command) => async (dataset: string) => {
	try {
		const module = await import(`../data/${dataset}.json`)
		
		for (const [id, value] of Object.entries(module.default)) {
			schemas[dataset].parse(value)
		}
	} catch (exception) {
		program.error(exception as string)
	}
}