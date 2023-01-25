import { MenuForm, MenuFormValues } from "components/MenuForm";
import { Formik } from "formik";
import React, { FC, memo, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { useOrganization } from "hooks/useOrganization";
import { menusService } from "domain/services/menusService";
import { paths } from "paths";
import { AxiosResponse } from "axios";
import { Menu } from "domain/models/Menu";
import { menuSchema } from "domain/util/validators";
import { mapTranslation } from "domain/util/formik";
import { nextTick } from "util/nextTick";

interface Props {}

export const MenuCreatePage: FC<Props> = memo(function MenuCreatePage() {
  const {
    handleSubmit,
    toCategoriesPicker,
    initialValues,
  } = useMenuCreatePage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={menuSchema}
    >
      <MenuForm toCategoriesPicker={toCategoriesPicker} />
    </Formik>
  );
});

function useMenuCreatePage() {
  const queryClient = useQueryClient();
  const params = useParams<{ slug: string; menu?: string }>();
  const { slug } = params;
  const { replace } = useHistory();
  const organization = useOrganization();

  const initialValues = useMemo(() => {
    const typography = mapTranslation(organization?.languages);

    return {
      name: typography,
      description: typography,
      activeTimeStart: null,
      activeTimeEnd: null,
      categories: [],
      image: undefined,
    };
  }, [organization?.languages]);

  const handleCreateSuccess = useCallback(
    ({ data: menu }: AxiosResponse<Menu>) => {
      queryClient.setQueryData<Menu[]>("menus", (old) => {
        return [...(old ?? []), menu];
      });
      nextTick(() => replace(paths.menu(menu.id, slug)));
    },
    [queryClient, replace, slug]
  );

  const { mutateAsync: createMenu } = useMutation(
    (values: MenuFormValues) => {
      const {image, ...rest} = values;
      if (image instanceof File) {
        return menusService.createMenu(rest, image);
      }
      return menusService.createMenu({...rest, image});
    },
    {
      onSuccess: handleCreateSuccess,
    }
  );

  const handleSubmit = useCallback(
    (values: MenuFormValues) => {
      return createMenu(values);
    },
    [createMenu]
  );

  const toCategoriesPicker = paths.createCategoriesPicker(slug);

  return { handleSubmit, toCategoriesPicker, initialValues };
}

export default MenuCreatePage;
