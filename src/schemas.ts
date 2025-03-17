import {z} from "zod"

export const Range = z.number().positive()

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
		areaOfEffect: z.union([z.number(), z.enum(["controlRange", "self"])]),
		cost: z.number().positive(),
		duration: z.enum(["round", "upkeep"]),
		offensive: z.boolean(),
		power: z.number().positive().optional(),
		range: Range.optional(),
	})
})