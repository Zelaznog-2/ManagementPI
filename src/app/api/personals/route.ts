import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createPersonal,
  deletePersonal,
  updatePersonal,
} from "@/lib/api/personals/mutations";
import {
  personalIdSchema,
  insertPersonalParams,
  updatePersonalParams
} from "@/lib/db/schema/personals";

export async function POST(req: Request) {
  try {
    const validatedData = insertPersonalParams.parse(await req.json());
    const { personal } = await createPersonal(validatedData);

    revalidatePath("/personals"); // optional - assumes you will have named route same as entity

    return NextResponse.json(personal, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updatePersonalParams.parse(await req.json());
    const validatedParams = personalIdSchema.parse({ id });

    const { personal } = await updatePersonal(validatedParams.id, validatedData);

    return NextResponse.json(personal, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = personalIdSchema.parse({ id });
    const { personal } = await deletePersonal(validatedParams.id);

    return NextResponse.json(personal, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
