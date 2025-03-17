import {z} from "zod"

export const Range = z.union([z.number().positive(), z.literal("self")])

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