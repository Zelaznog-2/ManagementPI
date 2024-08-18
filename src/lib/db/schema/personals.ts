import { personalSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getPersonals } from "@/lib/api/personals/queries";


// Schema for personals - used to validate API requests
const baseSchema = personalSchema.omit(timestamps)

export const insertPersonalSchema = baseSchema.omit({ id: true });
export const insertPersonalParams = baseSchema.extend({
  salary: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updatePersonalSchema = baseSchema;
export const updatePersonalParams = updatePersonalSchema.extend({
  salary: z.coerce.number()
}).omit({ 
  userId: true
});
export const personalIdSchema = baseSchema.pick({ id: true });

// Types for personals - used to type API request params and within Components
export type Personal = z.infer<typeof personalSchema>;
export type NewPersonal = z.infer<typeof insertPersonalSchema>;
export type NewPersonalParams = z.infer<typeof insertPersonalParams>;
export type UpdatePersonalParams = z.infer<typeof updatePersonalParams>;
export type PersonalId = z.infer<typeof personalIdSchema>["id"];
    
// this type infers the return from getPersonals() - meaning it will include any joins
export type CompletePersonal = Awaited<ReturnType<typeof getPersonals>>["personals"][number];

