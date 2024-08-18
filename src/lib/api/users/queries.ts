import { db } from "@/lib/db/index";

export const checkUserDb = async (email: string | null | undefined) => {
  try{
    if (!email) return null;

    const user = await db.user.findFirst({ where: {email: email} });

    if (user) {
      return user
    }

    return null;
  } catch(err) {
    console.log('checkUserDb Error', err);
    return null
  }
};