
import { getUserId } from "@/lib/api/personals/queries";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request) {
  const { session } = await getUserAuth();
  const userId = await getUserId()
  if (!session) return new Response("Error", { status: 400 });
  const body = (await request.json()) as { name?: string; email?: string };

  await db.user.update({ where: { id: userId }, data: { ...body } });
  revalidatePath("/account");
  return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
}
