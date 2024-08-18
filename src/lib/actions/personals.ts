"use server";

import { revalidatePath } from "next/cache";
import {
  createPersonal,
  deletePersonal,
  updatePersonal,
} from "@/lib/api/personals/mutations";
import {
  PersonalId,
  NewPersonalParams,
  UpdatePersonalParams,
  personalIdSchema,
  insertPersonalParams,
  updatePersonalParams,
} from "@/lib/db/schema/personals";
import { getPersonalByExcel } from "../api/personals/queries";


const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePersonals = () => revalidatePath("/personals");

export const createPersonalAction = async (input: NewPersonalParams) => {
  try {
    const payload = insertPersonalParams.parse(input);
    await createPersonal(payload);
    revalidatePersonals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePersonalAction = async (input: UpdatePersonalParams) => {
  try {
    const payload = updatePersonalParams.parse(input);
    await updatePersonal(payload.id, payload);
    revalidatePersonals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePersonalAction = async (input: PersonalId) => {
  try {
    const payload = personalIdSchema.parse({ id: input });
    await deletePersonal(payload.id);
    revalidatePersonals();
  } catch (e) {
    return handleErrors(e);
  }
};

export const getPersonalByExcelAction = async() => {
  try {
    const { personals } = await getPersonalByExcel();
    const dataToExport = personals.map((person:any) => ({
      Name: person.name,
      Max: person._max.salary,
      Average: person._avg.salary,
    }))
    return dataToExport
  } catch (e) {
    return handleErrors(e);
  }
}