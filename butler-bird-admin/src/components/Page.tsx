import React, { FC, memo } from "react";
import style from "styles/components/Page.module.scss";

interface Props {}

export const Page: FC<Props> = memo(function Page({ children }) {
  usePage();

  return <main className={style.container}>{children}</main>;
});

function usePage() {}
