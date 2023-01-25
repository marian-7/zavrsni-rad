import React, { ChangeEvent, FC, memo, useCallback } from "react";
import { Rating } from "components/Rating";
import { useField } from "formik";
import { RatingProps } from "@material-ui/lab";

type Props = RatingProps & {
  name: string;
};

export const FormikRating: FC<Props> = memo(function FormikRating(props) {
  const { field, handleChange } = useFormikRating(props.name);

  return <Rating {...field} {...props} onChange={handleChange} />;
});

function useFormikRating(name: string) {
  const [field, , { setValue }] = useField(name);

  const handleChange = useCallback(
    (event: ChangeEvent<{}>, value: number | null) => {
      setValue(value);
    },
    [setValue]
  );

  return { field, handleChange };
}
