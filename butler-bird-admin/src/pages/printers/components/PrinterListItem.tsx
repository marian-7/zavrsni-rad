import React, { FC, memo } from "react";
import { Printer } from "domain/models/Printer";
import { LinkButton } from "components/LinkButton";
import { paths, withSlug } from "paths";
import classNames from "classnames";
import listItemStyle from "styles/components/ListItem.module.scss";
import style from "styles/pages/printers/components/PrinterListItem.module.scss";
import { Typography } from "@material-ui/core";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";

interface Props {
  printer: Printer;
}

export const PrinterListItem: FC<Props> = memo(function PrinterListItem(props) {
  const { printer } = props;
  usePrinterListItem();

  return (
    <li>
      <LinkButton
        to={withSlug(paths.printer(printer.id))}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        <Typography
          className={classNames(
            listItemStyle.title,
            style.title,
            style.textOverflow
          )}
        >
          {printer.name || printer.serialNumber}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          <Typography
            className={classNames(listItemStyle.label, style.textOverflow)}
          >
            {printer.name && printer.serialNumber}
          </Typography>
          <ArrowIcon className={classNames(listItemStyle.icon, style.icon)} />
        </div>
      </LinkButton>
    </li>
  );
});

function usePrinterListItem() {}
