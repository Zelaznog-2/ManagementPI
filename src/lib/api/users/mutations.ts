import { db } from "@/lib/db/index";
import {
  NewUserParams,
  insertUserSchema,
} from "@/lib/db/schema/users";

export const createUser = async (personal: NewUserParams) => {
  const newPersonal = insertUserSchema.parse({ ...personal });
  try {
    const p = await db.user.create({ data: newPersonal });
    const {password: _, ...user} = p
    return { user };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error('createUser Error,', message);
    throw { error: message };
  }
};

export const updateEmail = async (id: string) => {
  try {
    await db.user.update({ where: { id }, data: { emailVerified: new Date() } });
    return { message: "Email Verified successfully" };
  } catch (err) {
    const message = (err as Error).message?? "Error, please try again";
    console.error('updateEmail Error,', message);
    throw { error: message };
  }
}