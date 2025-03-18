import {SafeParseReturnType, ZodType} from "zod"
import {Command} from "commander"
import output from "./output"
import * as fs from "node:fs"
import Ability from "./schemas/Ability"
import Advantage from "./schemas/Advantage"
import Spell from "./schemas/Spell"
import {Dataset} from "./schemas/primitives"
import Keyword from "./schemas/Keyword"
import {BaseUnit, unitSchema} from "./schemas/units";
import CommandCard from "./schemas/CommandCard";

const schemas: { [key: string]: ZodType } = {
	"abilities": Ability,
	"advantages": Advantage,
	"command-cards": CommandCard,
	"keywords": Keyword,
	"spells": Spell,
	"cryx": BaseUnit,
}

/**
 * Validate the existing data files, following the expected schema formats.
 */
export const validate = (program: Command) => async (dataset: string) => {
	try {
		// If the default argument is provided, validate all schemas, else validate only the required one.
		const datasets = dataset === 'all' ? Object.keys(schemas) : [dataset]
		
		// Loop through all required schemas, and validate in turn.
		for (const schema of datasets) {
			process.stdout.write(output.info(`Validating data/${schema}.json... `))
			
			const module = await import(`../data/${schema}.json`)
			
			// First we ensure that the file's structure matches the required format.
			Dataset.parse(module.default)
			
			// Then we loop through each record and validate against the appropriate schema
			for (const record of Object.values(module.default)) {
				const result = parse(schema, record)
				
				if (!result.success) {
					// @ts-ignore
					throw new Error(`Invalid schema for ${record.name}: ${result.error.message}`)
				}
			}
			
			console.log(output.success(`Done.`))
		}
	} catch (exception) {
		program.error(exception as string)
	}
}

/**
 * Builds the appendix.json file. To do this, it loops through all data files, pulls out the key and then creates a map of key -> data file. This allows
 * fast lookups of required records in the data files, and will error if non-unique values are found.
 */
export const build = (program: Command) => async () => {
	// First we validate - no point in building if the data files are incorrect
	await validate(program)('all')
	
	process.stdout.write(output.info("Building appendix.json... "))
	
	let map: { [key: string]: string } = {}
	
	for (const schema of Object.keys(schemas)) {
		const module = await import(`../data/${schema}.json`)
		
		for (const key of Object.keys(module.default)) {
			if (map[key]) {
				program.error(`Duplicate discovered for key ${key} in schema data/${schema}.json. Original key found in data/${map[key]}.json`)
			}
			
			map[key] = schema
		}
	}
	
	const appendix = JSON.stringify(Object.keys(map).sort().reduce(
		(obj: { [key: string]: string }, key: string) => {
			obj[key] = map[key]
			return obj
		}, {}
	), null, 4)
	
	const buildDirectory = process.cwd() + '/build'
	
	if (!fs.existsSync(buildDirectory)) {
		fs.mkdirSync(buildDirectory)
	}
	
	fs.writeFileSync(`${buildDirectory}/appendix.json`, appendix)
	
	console.log(output.success('Done.'))
}

/**
 * Our parse requirements get complex quick. If the base schema is a Unit, then first we want to work out what kind of unit it is. If we
 * can determine a unit, then we'll use the returned Schema object, else we'll defer to Unit.
 */
const parse = (schema: string, record: any): SafeParseReturnType<any, any> => {
	const parser = schemas[schema] === BaseUnit ? unitSchema(record as { type: string }) : schemas[schema]
	
	return parser.safeParse(record)
}