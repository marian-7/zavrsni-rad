import { useMutation, useQueryClient } from "react-query";
import { menusService } from "domain/services/menusService";
import { Menu } from "domain/models/Menu";
import { UseMutationOptions } from "react-query/types/react/types";
import { AxiosResponse } from "axios";
import { MenuFormValues } from "../components/MenuForm";

interface Context {
  menu?: Menu;
  menus?: Menu[];
}

export function useUpdateMenu(
  options?: UseMutationOptions<AxiosResponse<Menu>, unknown, MenuFormValues & {id: number}, Context>
) {
  const qc = useQueryClient();

  return useMutation<AxiosResponse<Menu>, unknown, MenuFormValues & {id: number}, Context>(
    (data) => {
      const {image, ...rest} = data;
      if (image instanceof File) {
        return menusService.updateMenu(rest, image);
      }
      return menusService.updateMenu({...rest, image});
    },
    {
      ...options,
      onMutate: (data) => {
        let menu: Menu | undefined;
        let menus: Menu[] | undefined;

        qc.setQueryData<Menu | undefined>(["menus", data.id], (old) => {
          menu = old;
          if (!old) {
            return old;
          }
          return { ...old, ...data };
        });

        qc.setQueryData<Menu[] | undefined>("menus", (old) => {
          menus = old;
          return old?.map((mOld) =>
            mOld.id === data.id ? { ...mOld, ...data } : mOld
          );
        });

        options?.onMutate?.(data);

        return { menu, menus };
      },
      onSuccess: (response, vars, context) => {
        const data = response.data;
        qc.setQueryData<Menu>(["menus", data.id], data);

        qc.setQueryData<Menu[]>("menus", (old) => {
          return (
            old?.map((menu) => {
              return menu.id === data.id ? { ...menu, ...data } : menu;
            }) ?? []
          );
        });

        options?.onSuccess?.(response, vars, context);
      },
      onError: (err, data, context) => {
        qc.setQueryData<Menu | undefined>(["menus", data.id], context?.menu);
        qc.setQueryData<Menu[] | undefined>("menus", context?.menus);

        options?.onError?.(err, data, context);
      },
    }
  );
}
