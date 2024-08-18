
import { type Personal, type CompletePersonal } from "@/lib/db/schema/personals";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Personal>) => void;

export const useOptimisticPersonals = (
  personals: CompletePersonal[],
  
) => {
  const [optimisticPersonals, addOptimisticPersonal] = useOptimistic(
    personals,
    (
      currentState: CompletePersonal[],
      action: OptimisticAction<Personal>,
    ): CompletePersonal[] => {
      const { data } = action;

      

      const optimisticPersonal = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPersonal]
            : [...currentState, optimisticPersonal];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPersonal } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticPersonal, optimisticPersonals };
};
