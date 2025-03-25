import {z} from "zod"
import {Range} from "@/schemas/primitives.ts"

export default z.object({
	name: z.string(),
	rules: z.string(),
	statistics: z.object({
		areaOfEffect: z.union([z.number().positive(), z.literal("controlRange")]).optional(),
		cost: z.number().positive(),
		duration: z.enum(["round", "upkeep"]).optional(),
		offensive: z.boolean(),
		power: z.union([z.number().positive(), z.string().regex(new RegExp("^[0-9]+/[0-9]+$"))]).optional(),
		range: Range.optional(),
	})
})
