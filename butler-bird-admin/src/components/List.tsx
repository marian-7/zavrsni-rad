import React, { FC, memo, ReactNode } from "react";
import style from "styles/components/List.module.scss";
import { IconButton, Typography } from "@material-ui/core";
import { ReactComponent as HelpIcon } from "assets/icons/help-outline.svg";
import { LinkButton } from "components/LinkButton";
import { useTranslation } from "react-i18next";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

interface Props {
  title: string;
  helpText?: string;
  addNewTo?: string;
  listHeader?: ReactNode;
  replaceBody?: boolean;
  orderTicketsLink?: any;
}

export const List: FC<Props> = memo(function List({
  title,
  addNewTo,
  listHeader,
  children,
  helpText,
  replaceBody = false,
  orderTicketsLink,
}) {
  useList();
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.headerContent}>
          <Typography
            variant="h2"
            component="h1"
            className={style.title}
            title={title}
          >
            {title}
          </Typography>
          {helpText && (
            <IconButton className={style.help} color="primary" component="span">
              <HelpIcon />
            </IconButton>
          )}
          {orderTicketsLink}
        </div>
        {addNewTo && (
          <LinkButton
            className={style.add}
            to={addNewTo}
            type="button"
            variant="contained"
            color="primary"
          >
            {t("buttons.addNew")}
          </LinkButton>
        )}
      </div>
      {listHeader && <div className={style.listActions}>{listHeader}</div>}
      {replaceBody ? (
        children
      ) : (
        <OverlayScrollbarsComponent
          className={style.body}
          options={{
            scrollbars: { autoHide: "scroll" },
            sizeAutoCapable: false,
          }}
        >
          <ul className={style.list}>{children}</ul>
        </OverlayScrollbarsComponent>
      )}
    </div>
  );
});

function useList() {}
