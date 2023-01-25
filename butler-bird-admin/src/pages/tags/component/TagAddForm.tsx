import React, { FC, memo } from "react";
import { FormikInput } from "components/FormikInput";
import style from "styles/pages/tags/components/TagAddForm.module.scss";
import { FormLanguagePicker } from "components/FormLanguagePicker";
import { useTranslation } from "react-i18next";
import { ReactComponent as SaveIcon } from "assets/icons/done.svg";
import { Button } from "components/Button";
import { Typography } from "domain/models/Typography";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import classNames from "classnames";
import { FormikCheckbox } from "components/FormikCheckbox";
import { Form } from "components/Form";

export interface TagFormValues {
  name: Typography;
  organizational?: boolean;
}

type Props = {
  editable?: boolean;
  onDelete?: () => void;
  creating?: boolean;
  updating?: boolean;
  deleting?: boolean;
  disabled?: boolean;
};

export const TagAddForm: FC<Props> = memo(function TagAddForm(props) {
  const { editable, creating, updating, deleting, disabled = false } = props;
  const { t, handleDelete } = useTagAddForm(props);

  function renderName({ pickerLng }: { pickerLng: string }) {
    return (
      <FormikInput
        name={`name.${pickerLng}`}
        placeholder={t("form.placeholders.tagName")}
        className={style.name}
        withHelperText={false}
        disabled={disabled}
      />
    );
  }

  return (
    <Form>
      <div className={style.inputs}>
        <FormLanguagePicker helper={false} className={style.picker}>
          {renderName}
        </FormLanguagePicker>
        <FormikCheckbox
          name="organizational"
          label={t("pages.tags.global")}
          disabled={disabled}
        />
      </div>
      {!editable ? (
        <Button
          type="submit"
          startIcon={<SaveIcon />}
          rootClassName={classNames(style.btn, style.btnSaveTag)}
          loading={creating}
        >
          {t("pages.tags.saveTag")}
        </Button>
      ) : (
        <div className={style.actions}>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            rootClassName={style.btn}
            disabled={updating || disabled}
            loading={deleting}
          >
            {t("buttons.delete")}
          </Button>
          <Button
            type="submit"
            startIcon={<SaveIcon className={style.saveIcon} />}
            rootClassName={classNames(style.btn, style.btnSaveChanges)}
            loading={updating}
            disabled={deleting || disabled}
          >
            {t("buttons.saveChanges")}
          </Button>
        </div>
      )}
    </Form>
  );
});

function useTagAddForm({ onDelete }: Props) {
  const { t } = useTranslation();

  const handleDelete = () => {
    onDelete?.();
  };

  return { t, handleDelete };
}
