import React, {
  CSSProperties,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import ImageDropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import style from "../styles/components/Dropzone.module.scss";
import { IconButton, InputLabel, Typography } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete-alt.svg";
import { Image } from "domain/models/Image";

type Props = {
  name: string;
  value?: Image | File;
  onValueChanged: (value?: File | null) => void;
  label?: string;
  fitMode?: CSSProperties["objectFit"];
};

export const ImagePicker: FC<Props> = memo(function Dropzone(props) {
  const { t, handleImageUpload, removeImage, url } = useImagePicker(props);
  const { label, fitMode = "cover" } = props;

  function showPhoto() {
    return (
      <>
        <img
          className={style.image}
          src={url}
          alt={url}
          style={{ objectFit: fitMode }}
        />
        <IconButton
          onClick={removeImage}
          component="span"
          className={style.delete}
        >
          <DeleteIcon />
        </IconButton>
      </>
    );
  }

  function renderDropzone() {
    return (
      <ImageDropzone onDrop={handleImageUpload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className={style.input}>
            {url ? (
              showPhoto()
            ) : (
              <>
                <input {...getInputProps()} className={style.input} />
                <Typography variant="body1">
                  {t("components.dropzone.placeholder")}
                </Typography>
              </>
            )}
          </div>
        )}
      </ImageDropzone>
    );
  }

  if (label) {
    return (
      <div>
        <InputLabel shrink className={style.label}>
          {label}
        </InputLabel>
        {renderDropzone()}
      </div>
    );
  }
  return renderDropzone();
});

function useImagePicker({ onValueChanged, value }: Props) {
  const { t } = useTranslation();

  const url = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return value?.url;
  }, [value]);

  const handleImageUpload = useCallback(
    <T extends File>(acceptedFiles: T[]) => {
      onValueChanged(acceptedFiles[0]);
    },
    [onValueChanged]
  );

  const removeImage = useCallback(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }
    onValueChanged(null);
  }, [onValueChanged, url]);

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  return { t, handleImageUpload, removeImage, url };
}
