import {z} from "zod"
import {Range} from "./primitives"

export default z.object({
	name: z.string(),
	rules: z.string(),
	type: z.enum(["action", "attack", "passive", "weapon"]),
	range: Range.optional()
})
