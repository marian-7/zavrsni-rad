import React, {
  FC,
  FormEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FormikFormProps, FormikValues, useFormikContext } from "formik";
import { isEqual } from "lodash";
import { matchPath, useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Typography } from "domain/models/Typography";
import { useSnackbar } from "hooks/useSnackbar";

interface Values extends FormikValues {
  name?: Typography;
  description?: Typography;
  longDescription?: Typography;
}

type Props = FormikFormProps & {};

export const Form: FC<Props> = memo(function Form(props) {
  const { handleFormSubmit } = useForm();

  return <form {...props} onSubmit={handleFormSubmit} />;
});

function useForm() {
  const { block } = useHistory();
  const { show } = useSnackbar();
  const routeMatch = useRouteMatch();
  const formik = useFormikContext<Values>();
  const { submitForm, validateForm } = formik;
  const { t } = useTranslation();
  const submittedRef = useRef(false);

  const formikRef = useRef(formik);
  formikRef.current = formik;

  const handleFormSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();
      const errors = await validateForm();
      if (errors?.name || errors?.description || errors?.longDescription) {
        show(t("form.validation.languageValues"));
      } else {
        submittedRef.current = false;
        try {
          await submitForm();
          submittedRef.current = true;
        } catch (e) {}
      }
    },
    [show, submitForm, t, validateForm]
  );

  useEffect(() => {
    if (routeMatch.isExact) {
      let unblock = block((tx) => {
        const match = matchPath(tx.pathname, routeMatch);
        const { initialValues, values } = formikRef.current;
        const isValuesDifferent = !isEqual(values, initialValues);
        if (
          (match === null || match.isExact) &&
          isValuesDifferent &&
          !submittedRef.current
        ) {
          return window.confirm(t("form.validation.unsavedChanges"))
            ? undefined
            : false;
        }
      });

      return () => {
        unblock();
      };
    }
  }, [block, routeMatch, t]);

  useEffect(() => {
    const beforeunload = (e: BeforeUnloadEvent) => {
      const { initialValues, values } = formikRef.current;
      const isValuesDifferent = !isEqual(values, initialValues);
      if (isValuesDifferent) {
        e.preventDefault();
        return (e.returnValue = t("form.validation.unsavedChanges"));
      }
    };

    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [t]);

  return { t, handleFormSubmit };
}
