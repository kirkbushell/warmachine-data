import {SafeParseReturnType, ZodType} from "zod"
import {Command} from "commander"

import output from "@/output.ts"
import fsPromises from "node:fs/promises"
import fs from "node:fs"
import Ability from "@/schemas/Ability.ts"
import Advantage from "@/schemas/Advantage.ts"
import Spell from "@/schemas/Spell.ts"
import {Dataset} from "@/schemas/primitives.ts"
import Rule from "@/schemas/Rule.ts"
import {BaseUnit, unitSchema} from "@/schemas/units.ts"
import CommandCard from "@/schemas/CommandCard.ts"
import Quality from "@/schemas/Quality.ts"
import Army from "@/schemas/Army.ts"
import Faction from "@/schemas/Faction.ts"
import {pathToFileURL} from "node:url"

const schemas: { [key: string]: ZodType } = {
	"abilities": Ability,
	"armies": Army,
	"advantages": Advantage,
	"commands": CommandCard,
	"factions": Faction,
	"rules": Rule,
	"qualities": Quality,
	"spells": Spell,
	"units/cryx": BaseUnit,
	"units/cygnar": BaseUnit,
}

const timer = async (command: () => Promise<any>) => {
	const start = performance.now()
	
	await command();
	
	const end = performance.now()
	const time = Math.round((end - start) * 100) / 100
	
	console.log(output.info(`Completed in: ${time} ms`))
}

/**
 * Validate the existing data files, following the expected schema formats.
 */
export const validate = (program: Command) => async (dataset: string) => timer(async () => {
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
})

const buildIndex = async (program: Command) => {
	let map: { [key: string]: string } = {}
	
	for (const schema of Object.keys(schemas)) {
		const module = await import(`../data/${schema}.json`)
		
		for (const entry of Object.keys(module.default)) {
			const prefix = singular(schema).split('/').pop()
			const key = prefix + ':' + entry
			
			if (map[key]) {
				program.error(`Duplicate discovered for key ${key} in schema data/${schema}.json. Original key found in data/${map[key]}.json`)
			}
			
			map[key] = schema
		}
	}
	
	const contents = JSON.stringify(Object.keys(map).sort().reduce(
		(obj: { [key: string]: string }, key: string) => {
			obj[key] = map[key]
			return obj
		}, {}
	), null, 4)
	
	writeToJSON('index.json', contents)
}

const buildKeywords = async (program: Command) => {
	const dirname = pathToFileURL(`${import.meta.dirname}/../data/units`)
	let keywords: string[] = []
	
	const modules = await fsPromises.readdir(dirname).then((files) => Promise.all(files.map(file => import(`${dirname}/${file}`))))
	
	for (const json of modules) {
		const entries: { keywords: string[] }[] = Object.values(json)
		
		for (const entry of entries) {
			keywords = keywords.concat(entry.keywords)
		}
	}
	
	// Here we remove all duplicates and falsey values
	const contents = JSON.stringify([...new Set(keywords.filter(k => k))], null, 4)
	
	writeToJSON('keywords.json', contents)
}

const writeToJSON = (file: string, contents: string) => {
	const directory = process.cwd() + '/data'
	
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory)
	}
	
	fs.writeFileSync(directory + '/' + file, contents)
}

/**
 * Builds two aggregate data files: index.json and keywords.json. Index is as its name suggests, and index of all entries within the datasets. Keywords in contrast,
 * is a simple aggregated list of all keywords found within all unit json files.
 */
export const index = (program: Command) => async () => timer(async () => {
	// First we validate - no point in building if the data files are incorrect
	await validate(program)('all')
	
	process.stdout.write(output.info("Building aggregate datasets... "))
	
	await Promise.all([
		buildIndex(program),
		buildKeywords(program)
	])
	
	console.log(output.success('Done.'))
})

/**
 * Our parse requirements get complex quick. If the base schema is a Unit, then first we want to work out what kind of unit it is. If we
 * can determine a unit, then we'll use the returned Schema object, else we'll defer to Unit.
 */
const parse = (schema: string, record: any): SafeParseReturnType<any, any> => {
	const parser = schemas[schema] === BaseUnit ? unitSchema(record as { type: string }) : schemas[schema]
	
	return parser.safeParse(record)
}

const singular = (word: string) => {
	const endings: Record<string, string> = {
		ves: 'fe',
		ies: 'y',
		i: 'us',
		zes: 'ze',
		ses: 's',
		es: 'e',
		s: ''
	};
	return word.replace(
		new RegExp(`(${Object.keys(endings).join('|')})$`),
		r => endings[r]
	);
}

const ucfirst = (text: string): string => {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
