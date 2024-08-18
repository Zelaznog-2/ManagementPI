import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPersonalById } from "@/lib/api/personals/queries";
import OptimisticPersonal from "./OptimisticPersonal";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PersonalPage({
  params,
}: {
  params: { personalId: string };
}) {

  return (
    <main className="overflow-auto">
      <Personal id={params.personalId} />
    </main>
  );
}

const Personal = async ({ id }: { id: string }) => {
  await checkAuth();

  const { personal } = await getPersonalById(id);
  

  if (!personal) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="personals" />
        <OptimisticPersonal personal={personal}  />
      </div>
    </Suspense>
  );
};
