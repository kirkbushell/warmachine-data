import {z} from "zod"

export default z.object({
	name: z.string(),
	rules: z.string(),
})