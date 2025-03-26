import {expect, test} from "vitest"
import {entry, index, find, fullText} from "./lib.ts"

test("index json object can be retrieved", async () => {
	expect(await index()).toMatchObject({'ability:acidBlast': 'abilities'})
})

test("entries from any data file can be retrieved", async () => {
	expect(await entry('mechanithrallSwarm', 'units/cryx')).toMatchObject({"name": "Mechanithrall Swarm"})
})

test("looking up entries via the index returns the appropriate record.", async () => {
	expect(await find('advantage:incorporeal')).toMatchObject({"name": "Incorporeal"})
})

test("fulltext can be used to replace rule references with their appropriate text", async () => {
	const content = "This should have {rule:blind} and {rule:shadowBind} replaced with their full names."
	const result = await fullText(content)
	
	expect(result).not.toContain("{ability:blind}")
	expect(result).toContain('Blind')
})

test("fulltext option can be used to replace reference arguments with their appropriate text and values", async () => {
	const content = "RNG 5. Target friendly Faction warrior model/unit. If the model/unit is in range, it gains {ability:reposition-3} for one turn."
	const result = await fullText(content)
	
	expect(result).not.toContain("{ability:reposition-3}")
	expect(result).toContain('Reposition [3"]')
})

test("fulltext option can be used to replace referenced ability arguments with their associated ability text", async () => {
	const content = "Let's handle {ability:fieldMarshal-ability:gang}"
	const result = await fullText(content)
	
	expect(result).not.toContain("{ability:fieldMarshal-gang}")
	expect(result).toContain('Field Marshal [Gang]')
})

test("fulltext can replace multiple references within a single string", async () => {
	const content = "Let's handle {quality:blessed} and {advantage:stealth}"
	const result = await fullText(content)
	
	expect(result).not.toContain("{quality:blessed}")
	expect(result).not.toContain("{advantage:stealth}")
	expect(result).toContain('Blessed')
	expect(result).toContain('Stealth')
})

test("fulltext leaves the reference string alone if it cannot find a valid entry", async () => {
	const content = "Let's handle {unknown}"
	const result = await fullText(content)
	
	expect(result).toContain("{unknown}")
})