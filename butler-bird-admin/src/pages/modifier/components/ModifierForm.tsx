import React, { FC, memo } from "react";
import style from "../../../styles/pages/modifier/ModifierPage.module.scss";
import { FormLanguagePicker } from "components/FormLanguagePicker";
import { ModifierType } from "./ModifierType";
import { ModifierRequired } from "./ModifierRequired";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import { Form } from "components/Form";
import { FormikInput } from "components/FormikInput";
import { useTranslation } from "react-i18next";
import { Typography as Text } from "domain/models/Typography";
import { Button } from "components/Button";
import { ModifierReuse } from "./ModifierReuse";
import { AccessLevel, Option, SelectionMode } from "domain/models/OptionGroup";
import { useFormikContext } from "formik";

export type ModifierCreateFormValues = {
  name: Text;
  selectionMode: SelectionMode;
  required: boolean | string;
  options: Option[];
  accessLevel: AccessLevel;
  isNew?: boolean;
};

type Props = {};

export const ModifierForm: FC<Props> = memo(function ModifierPage() {
  const { t, isSubmitting } = useModifierPage();

  return (
    <Form className={style.form}>
      <FormLanguagePicker helper={false} className={style.languagePicker}>
        {({ pickerLng }: { pickerLng: string }) => {
          return (
            <>
        <FormikInput
          name={`name.${pickerLng}`}
          placeholder={t("form.placeholders.modifierGroupName")}
          id={undefined}
        />
        <FormikInput
          name={`description.${pickerLng}`}
          placeholder={t("form.placeholders.modifierGroupDescription")}
          multiline
          rows={3}
          id={undefined}
        />
            </>
          );
        }}
      </FormLanguagePicker>
      <div>
        <ModifierType name="selectionMode" />
      </div>
      <div>
        <ModifierRequired name="required" />
      </div>
      <div>
        <ModifierReuse name="accessLevel" />
      </div>
      <Button
        loading={isSubmitting}
        type="submit"
        color="primary"
        variant="text"
        className={style.submit}
        endIcon={<ArrowIcon className={style.submitIcon} />}
      >
        {t("buttons.defineModifierItems")}
      </Button>
    </Form>
  );
});

function useModifierPage() {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();

  return { t, isSubmitting };
}
