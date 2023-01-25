import React, { ChangeEvent, FC, memo, useCallback } from "react";
import { Form, useFormikContext } from "formik";
import { FormikRadioGroup } from "components/formik/FormikRadioGroup";
import { InputLabel, Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { Radio } from "components/Radio";
import { FormikRating } from "components/formik/FormikRating";
import { FormikTextArea } from "components/formik/FormikTextArea";
import { Button } from "components/Button";
import style from "styles/components/feedback/app-feedback-form.module.scss";

type Props = {};

export const AppFeedbackForm: FC<Props> = memo(function AppFeedbackForm() {
  const { handleChange, isValid, isSubmitting } = useAppFeedbackForm();
  const { t } = useTranslation("common");

  return (
    <Form className={style.root}>
      <div className="d-flex flex-direction-column full-height">
        <div className={style.form}>
          <Typography className={style.title}>{t("navigation.feedbackSurvey")}</Typography>
          <div className={style.container}>
            <InputLabel className={style.label}>{t("navigation.label.firstTime")}</InputLabel>
            <FormikRadioGroup
              name="firstUsage"
              onChange={handleChange}
              className={style.radioGroup}
            >
              <Radio radioClassName={style.radio} label={t("navigation.option.yes")} value={true} />
              <Radio radioClassName={style.radio} label={t("navigation.option.no")} value={false} />
            </FormikRadioGroup>
            <div className={style.rating}>
              <InputLabel className={style.label}>{t("navigation.label.satisfaction")}</InputLabel>
              <FormikRating name="rating" />
            </div>
            <InputLabel className={style.label}>{t("navigation.label.interaction")}</InputLabel>
            <FormikRadioGroup
              name="preferredInteraction"
              onChange={handleChange}
              className={style.radioGroup}
            >
              <Radio
                className={style.noLine}
                radioClassName={style.radio}
                label={t("navigation.option.yes")}
                value={true}
              />
              <Radio
                className={style.noLine}
                radioClassName={style.radio}
                label={t("navigation.option.no")}
                value={false}
              />
            </FormikRadioGroup>
            <FormikTextArea
              label={t("navigation.label.else")}
              className={style.textArea}
              name="note"
            />
          </div>
        </div>
        <div className={style.submit}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isValid}
            loading={isSubmitting}
            fullWidth
            className={style.btn}
            loadingText={"loading"}
          >
            {t("button.submitAnswers")}
          </Button>
        </div>
      </div>
    </Form>
  );
});

function useAppFeedbackForm() {
  const { setFieldValue, isValid, isSubmitting } = useFormikContext();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(e.currentTarget.name, e.currentTarget.value === "true");
    },
    [setFieldValue]
  );

  return { handleChange, isValid, isSubmitting };
}
