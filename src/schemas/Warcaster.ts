import {Feat, Unit} from "./primitives"
import {z} from "zod"

export default Unit.extend({
	feat: Feat,
	spells: z.array(z.string()),
})
