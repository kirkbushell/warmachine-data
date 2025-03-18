import {z, ZodType} from "zod"
import {Abilities, Advantage, Faction, Feat, Points, Statistics, Weapons} from "./primitives"

const Record = z.object({}).strict()

export const BaseUnit = Record.extend({
	abilities: Abilities,
	advantages: z.array(Advantage),
	baseSize: z.number().positive(),
	faction: Faction,
	fieldAllowance: z.union([z.number().positive(), z.literal('c')]),
	keywords: z.array(z.string()),
	name: z.string(),
	statistics: Statistics,
	type: z.enum(["attachment", "battleEngine", "solo", "structure", "unit", "warbeast", "warcaster", "warjack", "warlock"]),
	weapons: Weapons
})

export const Warcaster = BaseUnit.extend({
	feat: Feat,
	rackSlots: z.number().positive(),
	spells: z.array(z.string()),
})

export const Solo = BaseUnit.extend({
	points: Points,
})

export const Unit = BaseUnit.extend({
	grunts: z.number().positive(),
	points: Points,
})

export const unitSchema = (record: { type: string }): ZodType => {
	switch (record.type) {
		case 'warcaster':
			return Warcaster
		case 'solo':
			return Solo
		case 'unit':
			return Unit
	}
	
	throw new Error(`Invalid unit type ${record.type}`)
}
