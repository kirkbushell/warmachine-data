import {z} from "zod"
import {Range} from "@/schemas/primitives.ts"

export default z.object({
	name: z.string(),
	rules: z.string(),
	type: z.enum(["action", "attack", "passive", "weapon"]),
	range: Range.optional()
})
