import React, {
  FC,
  memo,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import style from "styles/components/FormLanguagePicker.module.scss";
import { SimpleSelect } from "components/SimpleSelect";
import { I18nextContext } from "providers/I18nextProvider";
import { useOrganization } from "hooks/useOrganization";
import { useTranslation } from "react-i18next";
import { IconButton } from "@material-ui/core";
import { ReactComponent as HelpIcon } from "assets/icons/help-outline.svg";
import classNames from "classnames";

type Props = {
  children: (props: { pickerLng: string }) => ReactNode;
  helper?: boolean;
  className?: string;
};

export const FormLanguagePicker: FC<Props> = memo(function FormLanguagePicker({
  children,
  helper = true,
  className,
}) {
  const { pickerLng, languageOptions, setPickerLng } = useFormLanguagePicker();

  return (
    <>
      <div className={classNames(style.selectContainer, className)}>
        <SimpleSelect
          className={style.select}
          initialValue={pickerLng}
          options={languageOptions}
          onChange={setPickerLng}
        />
        {helper && (
          <IconButton color="primary" component="span">
            <HelpIcon />
          </IconButton>
        )}
      </div>
      {children({ pickerLng: pickerLng })}
    </>
  );
});

function useFormLanguagePicker() {
  const { t } = useTranslation();
  const { lng } = useContext(I18nextContext);
  const [pickerLng, setPickerLng] = useState(lng);
  const organization = useOrganization();

  const languageOptions = useMemo(() => {
    return (
      organization?.languages.map((language) => ({
        value: language,
        label: t(`languages.${language}`),
      })) ?? []
    );
  }, [organization?.languages, t]);

  return { pickerLng, setPickerLng, languageOptions };
}
