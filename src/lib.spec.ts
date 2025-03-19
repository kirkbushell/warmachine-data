import {expect, test} from "vitest"
import {entry, index, find, fullText} from "./lib"

test("index json object can be retrieved", async () => {
	expect(await index()).toMatchObject({"acidBlast": "abilities"})
})

test("entries from any data file can be retrieved", async () => {
	expect(await entry('mechanithrallSwarm', 'cryx')).toMatchObject({"name": "Mechanithrall Swarm"})
})

test("looking up entries via the index returns the appropriate record.", async () => {
	expect(await find('incorporeal')).toMatchObject({"name": "Incorporeal"})
})

test("fulltext can be used to replace placeholders with their appropriate text", async () => {
	const content = "This should have {blind} and {shadowBind} replaced with their full names."
	const result = await fullText(content)
	
	expect(result).not.toContain("{blind}")
	expect(result).toContain('Blind')
})

test("fulltext option can be used to replace keywords and placeholders with their appropriate text", async () => {
	const content = "RNG 5. Target friendly Faction warrior model/unit. If the model/unit is in range, it gains {reposition-3} for one turn."
	const result = await fullText(content)
	
	expect(result).not.toContain("{reposition-3}")
	expect(result).toContain('Reposition [3"]')
})

test("fulltext option can be used to replace keywords with their associated ability text", async () => {
	const content = "Let's handle {fieldMarshal-gang}"
	const result = await fullText(content)
	
	expect(result).not.toContain("{fieldMarshal-gang}")
	expect(result).toContain('Field Marshal [Gang]')
})