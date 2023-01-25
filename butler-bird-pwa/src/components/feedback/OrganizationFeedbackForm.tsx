import React, { FC, memo } from "react";
import { Form, useFormikContext } from "formik";
import { Typography } from "@material-ui/core";
import { FormikRating } from "components/formik/FormikRating";
import { FormikTextArea } from "components/formik/FormikTextArea";
import { useTranslation } from "next-i18next";
import { Button } from "components/Button";
import style from "styles/components/feedback/organization-feedback-form.module.scss";

type Props = {};

export const OrganizationFeedbackForm: FC<Props> = memo(function OrganizationFeedbackForm() {
  useOrganizationFeedbackForm();
  const { t } = useTranslation("common");
  const { isValid } = useFormikContext();
  const { isSubmitting } = useFormikContext();

  return (
    <Form className="d-flex flex-direction-column full-height">
      <div className={style.form}>
        <Typography className={style.title}>{t("organizationFeedback.title")}</Typography>
        <div className={style.rating}>
          <Typography className={style.text}>{t("organizationFeedback.label.food")}</Typography>
          <FormikRating name="foodRating" />
        </div>
        <div className={style.rating}>
          <Typography className={style.text}>{t("organizationFeedback.label.speed")}</Typography>
          <FormikRating name="speedRating" />
        </div>
        <FormikTextArea
          label={t("organizationFeedback.label.else")}
          name="note"
          className={style.textArea}
        />
      </div>

      <div className={style.submit}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          className={style.btn}
          loading={isSubmitting}
          disabled={isSubmitting || !isValid}
        >
          {t("button.submitAnswers")}
        </Button>
      </div>
    </Form>
  );
});

function useOrganizationFeedbackForm() {}
