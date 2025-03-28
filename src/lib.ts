import {Dataset, Generic} from "@/types.ts"

export class DatasetError extends Error {

}

/**
 * @module warmachine-data/lib
 * @description This module provides a number of utility functions that can be used to work with the data in the warmachine data repository.
 * @author Kirk Bushell
 */

export const dataKeys = async (dataset: string) => {
	return Object.keys(await import(`../data/${dataset}.json`))
}

/**
 * Retrieve a single entry from any of the required data files. The dataset argument should be a reference to a file
 * in the data/ folder, without the .json suffix. Eg. entry('ironLichCommander', 'cryx'). This should only be used
 * when you know exactly where an entry resides.
 */
export const entry = async (id: string, dataset: string): Promise<Generic> => {
	const data = await file(`${dataset}.json`)
	
	// an id may consist of the following pattern: dataset:id. In order to facilitate that, we strip the first part of the string.
	id = id.split(':').pop() as string
	
	if (!data[id]) {
		throw new DatasetError(`Record not found for id ${id}`)
	}
	
	return {...data[id], dataset: dataset, id: id};
}

/**
 * Find an entry that exists in any of the files, by first looking at the index file, and then using the reference to
 * return the actual entry that has been requested.
 */
export const find = async (lookup: string) => {
	const dataset = (await index())[lookup]
	
	if (!dataset) {
		throw new DatasetError(`No dataset found for ${lookup}`)
	}
	
	const keyword = lookup.split(':').pop() as string
	
	return entry(keyword, dataset)
}

/**
 * Retrieves the index file's JSON object.
 */
export const index = async (): Promise<Dataset> => (await file("index.json"))

/**
 * Retrieves a specific file from with the data folder.
 */
export const file = async (file: string): Promise<Dataset> => (await import(`../data/${file}`)).default

/**
 * Replaces any placeholder/variables within the provided text with their fulltext versions.
 */
export const fullText = (content: string): Promise<string> => {
	const expression = /\{([a-z:]+)(-([a-z0-9:]+))*}/ig
	
	// @ts-ignore: Ignoring TS warning, as variadic arguments being used in this case, is rather important for this logic to work...
	const replacer = async (...args): string => {
		// The even index matches aren't values we're interested in, so we grab only the odd index elements.
		const oddArgs = oddKeys(args)
		
		// if args[3] is numeric, it's a static value, if it's a string, it's another reference. These replacements are then injected into the
		// content string at the appropriate locations, based on the regular expression.
		const replacements = await Promise.all(oddArgs.map(async (arg) => {
			try {
				return isNaN(Number(arg)) ? (await find(arg)).name : arg
			} catch (e) {
				if (e instanceof DatasetError) return ''
			}
			
			return ''
		}))
		
		const name: string = replacements.shift()!
		
		if (!name) {
			return `${args[0]}`
		}
		
		return name.replace(/\$([0-9])/, (...matches): string => replacements[matches[1] - 1])
	}
	
	return replaceAsync(content, expression, replacer)
}

const replaceAsync = async (content: string, regexp: RegExp, replacer: Function) => {
	const replacements = await Promise.all(
		Array.from(
			content.matchAll(regexp),
			(match) => replacer(...match)
		)
	)
	
	return content.replace(regexp, () => replacements.shift())
}

/**
 * Parses an array and only returns the elements where the key is an odd value (1, 3.etc.).
 */
const oddKeys = (input: string[]): string[] => {
	let values: string[] = []
	
	for (let i of input.keys()) {
		if (i % 2 === 0) continue
		
		values.push(input[i])
	}
	
	return values.filter(Boolean)
}