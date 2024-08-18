
import { z } from "zod";
// import { getPersonals } from "@/lib/api/personals/queries";
import { userSchema } from "@/zodAutoGenSchemas";


// Schema for personals - used to validate API requests
const baseSchema = userSchema

export const insertUserSchema = baseSchema.omit({ id: true });
export const insertUserParams = baseSchema.omit({
  id: true,
});

export const personalIdSchema = baseSchema.pick({ id: true });

// Types for personals - used to type API request params and within Components
export type User = z.infer<typeof userSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type NewUserParams = z.infer<typeof insertUserParams>;
export type UserId = z.infer<typeof personalIdSchema>["id"];

// this type infers the return from getPersonals() - meaning it will include any joins
// export type CompletePersonal = Awaited<ReturnType<typeof getPersonals>>["personals"][number];

