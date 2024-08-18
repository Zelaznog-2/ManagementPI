"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/personals/useOptimisticPersonals";
import { type Personal } from "@/lib/db/schema/personals";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import PersonalForm from "@/components/personals/PersonalForm";


export default function OptimisticPersonal({
  personal,

}: {
  personal: Personal;


}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Personal) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPersonal, setOptimisticPersonal] = useOptimistic(personal);
  const updatePersonal: TAddOptimistic = (input) =>
    setOptimisticPersonal({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PersonalForm
          personal={optimisticPersonal}

          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePersonal}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPersonal.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <div className="flex gap-4 flex-col">
        <span className="">Identification: <b>{optimisticPersonal.identification}</b></span>
        <span>Phone: <b>{optimisticPersonal.phone}</b></span>
        <span>Address: <b>{optimisticPersonal.address}</b></span>
        <span>Salary: <b>{optimisticPersonal.salary}</b></span>
      </div>
      {/* <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPersonal.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticPersonal, null, 2)}
      </pre> */}

    </div>
  );
}
