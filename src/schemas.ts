import {z} from "zod"
import {Advantage, Faction, Feat, Range, Statistics} from "./schema-primitives"

export const Ability = z.object({
	name: z.string(),
	rules: z.string(),
	type: z.enum(["action", "passive"]),
	range: Range.optional()
})

export const Spell = z.object({
	name: z.string(),
	rules: z.string(),
	statistics: z.object({
		areaOfEffect: z.union([z.number().positive(), z.literal("controlRange")]).optional(),
		cost: z.number().positive(),
		duration: z.enum(["round", "upkeep"]),
		offensive: z.boolean(),
		power: z.number().positive().optional(),
		range: Range.optional(),
	})
})

export const Unit = z.object({
	advantages: z.array(Advantage),
	baseSize: z.number().positive(),
	faction: Faction,
	fieldAllowance: z.union([z.number().positive(), z.literal('c')]),
	keywords: z.array(z.string()),
	name: z.string(),
	statistics: Statistics,
	type: z.enum(["attachment", "battleEngine", "solo", "structure", "unit", "warbeast", "warcaster", "warjack", "warlock"]),
})

export const Warcaster = Unit.extend({
	feat: Feat,
	spells: z.array(z.string()),
})
