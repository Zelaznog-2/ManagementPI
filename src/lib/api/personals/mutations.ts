import { db } from "@/lib/db/index";
import {
  PersonalId,
  NewPersonalParams,
  UpdatePersonalParams,
  updatePersonalSchema,
  insertPersonalSchema,
  personalIdSchema
} from "@/lib/db/schema/personals";
import { getUserId } from "./queries";



export const createPersonal = async (personal: NewPersonalParams) => {
  const userId = await getUserId()
  const newPersonal = insertPersonalSchema.parse({ ...personal, userId: userId });
  try {
    const p = await db.personal.create({ data: newPersonal });
    return { personal: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePersonal = async (id: PersonalId, personal: UpdatePersonalParams) => {
  const userId = await getUserId()
  const { id: personalId } = personalIdSchema.parse({ id });
  const newPersonal = updatePersonalSchema.parse({ ...personal, userId: userId });
  try {
    const p = await db.personal.update({ where: { id: personalId, userId: userId }, data: newPersonal})
    return { personal: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePersonal = async (id: PersonalId) => {
  const userId = await getUserId()
  const { id: personalId } = personalIdSchema.parse({ id });
  try {
    const p = await db.personal.delete({ where: { id: personalId, userId: userId }})
    return { personal: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

