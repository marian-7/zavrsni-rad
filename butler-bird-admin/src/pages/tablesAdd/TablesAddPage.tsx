import { SidePage } from "components/SidePage";
import { Formik, FormikProps, FormikValues } from "formik";
import React, { FC, memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TablesAddForm } from "pages/tablesAdd/components/TablesAddForm";
import { tablesAddSchema } from "domain/util/validators";
import { toNumber } from "lodash";
import { useMutation, useQueryClient } from "react-query";
import { tablesService } from "domain/services/tablesService";
import { useHistory, useParams } from "react-router-dom";
import { Table, Venue } from "domain/models/Venue";

interface Props {
  tables: Table[];
  closePath: string;
  onCreate: (tables: Table[]) => void;
}

export const TablesAddPage: FC<Props> = memo(function TablesAddPage(props) {
  const { closePath } = props;
  const { handleSubmit, formik } = useTablesAddPage(props);
  const { t } = useTranslation();

  return (
    <SidePage title={t("pages.tablesAdd.title")} to={closePath}>
      <Formik
        innerRef={formik}
        onSubmit={handleSubmit}
        initialValues={{}}
        validationSchema={tablesAddSchema}
      >
        <TablesAddForm cancelPath={closePath} />
      </Formik>
    </SidePage>
  );
});

function useTablesAddPage({ onCreate, closePath, tables }: Props) {
  const qc = useQueryClient();
  const formik = useRef<FormikProps<FormikValues>>(null);
  const { push } = useHistory();
  const params = useParams<{ venue?: string }>();
  const venue = params.venue ? toNumber(params.venue) : undefined;
  const { mutateAsync } = useMutation(tablesService.bulkCreate, {
    onSuccess: ({ data }) => {
      if (venue) {
        qc.setQueryData<Venue | undefined>(["venues", venue], (old) => {
          if (!old) {
            return old;
          }
          return { ...old, tables: old.tables.concat(data) };
        });
      }
      onCreate(data);
      push(closePath);
    },
  });

  function handleSubmit(values: FormikValues) {
    const { quantity, template } = values;

    const labelStartAt = tables.reduce((amount, { label }) => {
      const [, group] =
        new RegExp(`^${template.trim()} ([0-9]+)`).exec(label) ?? [];
      const number = group ? toNumber(group) + 1 : undefined;

      if (number && number > amount) {
        return number;
      }
      return amount;
    }, 1);

    return mutateAsync({
      venue,
      labelStartAt,
      amount: toNumber(quantity),
      labelTemplate: template,
    }).catch(() => {});
  }

  return { handleSubmit, formik };
}
