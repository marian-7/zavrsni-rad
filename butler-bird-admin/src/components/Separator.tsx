import { FC, memo } from "react";
import style from "styles/components/Separator.module.scss";

type Props = {
  mh?: number;
  size?: number;
};

export const Separator: FC<Props> = memo(function Separator({
  mh = 8,
  size = 8,
}) {
  useSeparator();

  return (
    <div
      className={style.separator}
      style={{ margin: `0 ${mh}px`, width: size, height: size, minWidth: size }}
    />
  );
});

function useSeparator() {}
