import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type PersonalId, personalIdSchema } from "@/lib/db/schema/personals";
import { checkUserDb } from "../users/queries";

export const getUserId = async() => {
  const { session } = await getUserAuth();
  const user = await checkUserDb(session?.user.email);
  return user?.id;
}

export const getPersonals = async () => {
  const userId = await getUserId()
  const p = await db.personal.findMany({ where: {userId: userId}});
  return { personals: p };
};

export const getPersonalById = async (id: PersonalId) => {
  const userId = await getUserId()
  const { id: personalId } = personalIdSchema.parse({ id });
  const p = await db.personal.findFirst({
    where: { id: personalId, userId: userId}});
  return { personal: p };
};


export const getPersonalByExcel = async () => {
  const userId = await getUserId()
  const p = await db.personal.groupBy({
    by: ['id', 'name'],
    _avg: {
      salary: true
    },
    _max: {
      salary: true
    },
    orderBy: {
      _max:{
        salary: 'desc'
      }
    },
    where: { userId: userId}
  })
  return { personals: p };
}

