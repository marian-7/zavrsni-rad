import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import { FormikInput } from "components/FormikInput";
import { useTranslation } from "react-i18next";
import style from "styles/pages/settingsStaffInvite/components/StaffInviteForm.module.scss";
import sidePageStyle from "styles/components/SidePage.module.scss";
import { Button } from "components/Button";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { ReactComponent as DoneIcon } from "assets/icons/done.svg";
import { NavLink as Link } from "react-router-dom";
import { paths, withSlug } from "paths";
import { Form } from "components/Form";

interface Props {}

export const StaffInviteForm: FC<Props> = memo(function StaffInviteForm() {
  const { isSubmitting } = useStaffInviteForm();
  const { t } = useTranslation();

  return (
    <Form className={style.form}>
      <FormikInput
        className={style.input}
        name="email"
        label={t("form.labels.emailAddress")}
        showErrorOnTouched
        errorIcon={false}
      />
      <div className={style.actions}>
        <Button
          component={Link}
          to={withSlug(paths.settingsStaff())}
          className={sidePageStyle.button}
          startIcon={<HighlightOffIcon />}
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          className={sidePageStyle.button}
          color="primary"
          startIcon={<DoneIcon />}
          type="submit"
          loading={isSubmitting}
        >
          {t("buttons.sendInvite")}
        </Button>
      </div>
    </Form>
  );
});

function useStaffInviteForm() {
  const { isSubmitting } = useFormikContext();

  return { isSubmitting };
}
