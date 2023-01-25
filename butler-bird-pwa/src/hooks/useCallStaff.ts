import { useCallback, useMemo } from "react";
import { useMutation } from "react-query";
import { createCustomOrder } from "domain/services/orderService";
import { useTable } from "hooks/useTable";
import { getToken } from "domain/services/userIdentification";

export function useCallStaff(showModal: () => void, setShowResult: () => void) {
  const { table } = useTable();

  const customOrderTypes = useMemo(() => {
    return table?.customOrderTypes;
  }, [table?.customOrderTypes]);

  const { mutate: callStaffMutation } = useMutation(
    async (values: { tableId: string | number; type: number }) => {
      const { tableId, type } = values;
      try {
        const installation = getToken();
        await createCustomOrder(tableId, type, installation);
        setShowResult();
      } catch (err) {
        throw err;
      }
    }
  );

  const handleCallStaff = useCallback(
    (tableId: string | number, type: number) => {
      callStaffMutation({ tableId, type });
    },
    [callStaffMutation]
  );

  const callStaff = useCallback(() => {
    if (table) {
      if (customOrderTypes && customOrderTypes.length === 1) {
        handleCallStaff(table.id, customOrderTypes[0].id);
      } else {
        showModal();
      }
    }
  }, [customOrderTypes, handleCallStaff, showModal, table]);

  return { callStaff, customOrderTypes, handleCallStaff };
}
