import { MenuForm, MenuFormValues } from "components/MenuForm";
import { Formik, FormikProps } from "formik";
import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { paths } from "paths";
import { menusService } from "domain/services/menusService";
import { useOrganization } from "hooks/useOrganization";
import { Menu } from "domain/models/Menu";
import { toNumber } from "lodash";
import { menuSchema } from "domain/util/validators";
import { useUpdateMenu } from "hooks/useUpdateMenu";
import { AxiosResponse } from "axios";
import { mapTranslation } from "domain/util/formik";
import { nextTick } from "util/nextTick";

interface Props {}

export const MenuPage: FC<Props> = memo(function MenuPage() {
  const {
    menu,
    initialValues,
    handleSubmit,
    toCategoriesPicker,
    handleMenuDelete,
    formik,
    isDeleting,
  } = useMenuPage();

  return (
    <Formik<MenuFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={menuSchema}
      innerRef={formik}
    >
      <MenuForm
        menu={menu}
        toCategoriesPicker={toCategoriesPicker}
        onMenuDelete={handleMenuDelete}
        deleting={isDeleting}
      />
    </Formik>
  );
});

function useMenuPage() {
  const formik = useRef<FormikProps<MenuFormValues>>(null);
  const queryClient = useQueryClient();
  const { replace } = useHistory();
  const params = useParams<{ slug: string; menu?: string }>();
  const { slug } = params;
  const id = params.menu ? toNumber(params.menu) : undefined;
  const organization = useOrganization();

  const { data: menu } = useQuery(
    ["menus", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      if (id) {
        return menusService.getMenu(id).then(({ data }) => data);
      }
    },
    {
      enabled: !!id,
      placeholderData: () =>
        queryClient.getQueryData<Menu[]>("menus")?.find((c) => c.id === id),
    }
  );

  const initialValues = useMemo(() => {
    const languages = organization?.languages;
    const name = mapTranslation(languages, menu?.name);
    const description = mapTranslation(languages, menu?.description);

    return {
      name: name,
      activeTimeStart: menu?.activeTimeStart,
      activeTimeEnd: menu?.activeTimeEnd,
      categories: menu?.categories,
      description: description,
      image: menu?.image
    };
  }, [
    menu?.activeTimeEnd,
    menu?.activeTimeStart,
    menu?.categories,
    menu?.description,
    menu?.name,
    menu?.image,
    organization?.languages,
  ]);

  const { mutateAsync: updateMenu } = useUpdateMenu();

  const handleSubmit = useCallback(
    (values: MenuFormValues) => {
      if (id) {
        const data = { ...values, id };
        return updateMenu(data);
      }
    },
    [id, updateMenu]
  );

  const handleDeleteSuccess = useCallback(
    ({ data: menu }: AxiosResponse<Menu>) => {
      queryClient.setQueryData<Menu[]>("menus", (old) => {
        return old?.filter((m) => m.id !== menu.id) ?? [];
      });
      nextTick(() => replace(paths.menus(slug)));
    },
    [queryClient, replace, slug]
  );

  const { mutateAsync: deleteMenu, isLoading: isDeleting } = useMutation(
    menusService.deleteMenu,
    {
      onSuccess: handleDeleteSuccess,
    }
  );

  const handleMenuDelete = useCallback(() => {
    if (id) {
      return deleteMenu(id);
    }
  }, [deleteMenu, id]);

  const toCategoriesPicker = paths.categoriesPicker(id, slug);

  return {
    menu,
    initialValues,
    handleSubmit,
    toCategoriesPicker,
    handleMenuDelete,
    formik,
    isDeleting,
  };
}

export default MenuPage;
