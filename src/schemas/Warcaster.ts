import {Feat, Unit} from "./primitives"
import {z} from "zod"

export default Unit.extend({
	feat: Feat,
	rackSlots: z.number().positive(),
	spells: z.array(z.string()),
})
