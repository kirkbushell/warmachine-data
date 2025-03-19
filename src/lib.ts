import {Dataset, Generic} from "./types"

/**
 * @module warmachine-data/lib
 * @description This module provides a number of utility functions that can be used to work with the data in the warmachine data repository.
 * @author Kirk Bushell
 */

/**
 * Retrieve a single entry from any of the required data files. The dataset argument should be a reference to a file
 * in the data/ folder, without the .json suffix. Eg. entry('ironLichCommander', 'cryx'). This should only be used
 * when you know exactly where an entry resides.
 */
export const entry = async (keyword: string, dataset: string): Promise<Generic> => {
	const data = await file(`${dataset}.json`)
	
	return data[keyword]
}


/**
 * Find an entry that exists in any of the files, by first looking at the index file, and then using the reference to
 * return the actual entry that has been requested.
 */
export const find = async (keyword: string) => {
	const dataset = (await index())[keyword]
	
	return entry(keyword, dataset)
}

/**
 * Retrieves the index file's JSON object.
 */
export const index = async (): Promise<Dataset> => await import("../build/index.json")

/**
 * Retrieves a specific file from with the data folder.
 */
export const file = async (file: string): Promise<Dataset> => await import(`../data/${file}`)

/**
 * Replaces any placeholder/variables within the provided text with their fulltext versions.
 */
export const fullText = (content: string): Promise<string> => {
	const expression = /\{([a-z]+)(-([a-z0-9]+))*}/ig
	// @ts-ignore: Ignoring as variadic arguments here is rather important for this logic to work...
	const replacer = async (...args): string => {
		args = oddKeys(args)
		
		// if args[3] is numeric, it's a variable, if it's a string, it's a reference to another ability
		const key: string = args.shift()!
		const name = (await find(key)).name
		
		if (args.length === 0) return name
		
		return name.replace(/\$([0-9])/, (...matches) => args[matches[1] - 1])
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