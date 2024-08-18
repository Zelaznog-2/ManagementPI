import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";


import {
  insertUserParams
} from "@/lib/db/schema/users";
import { createUser } from "@/lib/api/users/mutations";
import { checkUserDb } from "@/lib/api/users/queries";
import { hashPassword, cleanSpace } from "@/lib/utils";


export async function POST(req: Request) {
  try {
    const validatedData = cleanSpace(insertUserParams.parse(await req.json()));

    const checkUser = await checkUserDb(validatedData.email)
    if (checkUser) {
      return NextResponse.json({ error: 'Already registered user' }, { status: 500 });
    }

    // Create user in database
    validatedData.password = hashPassword(validatedData.password);
    const { user } = await createUser(validatedData);

    revalidatePath("/sign-in"); // optional - assumes you will have named route same as entity
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}