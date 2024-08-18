import { updateEmail } from "@/lib/api/users/mutations";

export async function PUT(request: Request) {

  const body = (await request.json()) as { id?: string; };

  if (!body.id) return new Response("Error", { status: 400 });

  await updateEmail(body?.id);

  return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
}