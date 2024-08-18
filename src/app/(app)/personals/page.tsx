import { Suspense } from "react";

import Loading from "@/app/loading";
import PersonalList from "@/components/personals/PersonalList";
import { getPersonals } from "@/lib/api/personals/queries";


export const revalidate = 0;

export default async function PersonalsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Personals</h1>
        </div>
        <Personals />
      </div>
    </main>
  );
}

const Personals = async () => {

  const { personals } = await getPersonals();

  return (
    <Suspense fallback={<Loading />}>
      <PersonalList personals={personals}  />
    </Suspense>
  );
};
