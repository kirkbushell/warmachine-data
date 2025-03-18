import {z} from "zod"
import {Range} from "./primitives"

export default z.object({
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
