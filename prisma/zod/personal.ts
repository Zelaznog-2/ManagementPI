import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const personalSchema = z.object({
  id: z.string(),
  name: z.string(),
  identification: z.string(),
  phone: z.string(),
  address: z.string(),
  salary: z.number(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePersonal extends z.infer<typeof personalSchema> {
  user: CompleteUser
}

/**
 * relatedPersonalSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPersonalSchema: z.ZodSchema<CompletePersonal> = z.lazy(() => personalSchema.extend({
  user: relatedUserSchema,
}))
