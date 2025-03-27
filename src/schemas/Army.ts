import {z} from "zod"
import {Faction} from "@/schemas/primitives.ts"

export default z.object({
	faction: Faction,
	name: z.string(),
})
