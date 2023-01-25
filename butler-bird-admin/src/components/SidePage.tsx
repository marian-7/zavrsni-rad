import React, {
  ChangeEvent,
  FC,
  memo,
  ReactElement,
  useCallback,
  useRef,
  useState,
} from "react";
import style from "styles/components/SidePage.module.scss";
import { CircularProgress, IconButton, Typography } from "@material-ui/core";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";
import { SearchInput } from "components/SearchInput";
import { NavLink as Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import { Button } from "./Button";
import { ReactComponent as PrinterIcon } from "assets/icons/printer.svg";
import { ReactComponent as PdfIcon } from "assets/icons/pdf.svg";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { Checkbox } from "components/Checkbox";
import { useOutsideClickDetector } from "hooks/useOutsideClickDetector";

type Props = {
  startIcon?: ReactElement;
  title: string;
  to: string;
  rootTo?: string;
  onStartIconClick?: () => void;
  search?: string;
  onSearchChange?: (search: string) => void;
  replaceList?: boolean;
  withActions?: boolean;
  actionsEnabled?: boolean;
  onSelectAll?: () => void;
  allItemsSelected?: boolean;
  onPrintClick?: () => void;
  onPdfClick?: () => void;
  onDeleteClick?: () => Promise<void>[];
  withBulkDelete?: boolean;
};

export const SidePage: FC<Props> = memo(function Picker(props) {
  const {
    title,
    to,
    children,
    search,
    startIcon,
    onStartIconClick,
    replaceList,
    withActions = false,
    actionsEnabled,
    onSelectAll,
    allItemsSelected,
    onPdfClick,
    onPrintClick,
    withBulkDelete = true,
  } = props;
  const {
    handleSearch,
    withSearch,
    deleting,
    handleDeleteAll,
    containerRef,
  } = usePicker(props);

  return (
    <div
      ref={containerRef}
      className={classNames("side-page", style.container)}
    >
      <div
        className={classNames(style.header, {
          [style.headerViewOnly]: !withSearch,
        })}
      >
        <div className={style.headerContent}>
          {startIcon && onStartIconClick && (
            <Button className={style.startIcon} onClick={onStartIconClick}>
              {startIcon}
            </Button>
          )}
          <Typography component="span" className={style.title} title={title}>
            {title}
          </Typography>
          <IconButton className={style.close} component={Link} to={to}>
            <CloseIcon className={style.closeIcon} />
          </IconButton>
        </div>
        {withSearch && (
          <SearchInput
            className={style.input}
            value={search}
            onChange={handleSearch}
          />
        )}
        {withActions && (
          <div className={style.actions}>
            <Checkbox onClick={onSelectAll} checked={allItemsSelected} />
            {actionsEnabled && (
              <>
                <IconButton onClick={onPrintClick} className={style.action}>
                  <PrinterIcon className={style.actionIcon} />
                </IconButton>
                <IconButton onClick={onPdfClick} className={style.action}>
                  <PdfIcon className={style.actionIcon} />
                </IconButton>
                {withBulkDelete && (
                  <IconButton
                    className={style.action}
                    onClick={handleDeleteAll}
                  >
                    {deleting ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <DeleteIcon className={style.actionIcon} />
                    )}
                  </IconButton>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {replaceList ? children : <ul className={style.list}>{children}</ul>}
    </div>
  );
});

function usePicker({
  onSearchChange,
  search,
  onDeleteClick,
  to,
  rootTo,
}: Props) {
  const withSearch = typeof search === "string";
  const [deleting, setDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { replace } = useHistory();

  const handleOutsideClick = useCallback(() => {
    replace(rootTo ?? to);
  }, [replace, rootTo, to]);

  useOutsideClickDetector(containerRef, handleOutsideClick);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    onSearchChange?.(e.currentTarget.value);
  }

  function handleDeleteAll() {
    if (deleting) {
      return;
    }
    setDeleting(true);
    if (onDeleteClick) {
      Promise.all<void>(onDeleteClick()).then(() => {
        setDeleting(false);
      });
    }
  }

  return { handleSearch, withSearch, deleting, handleDeleteAll, containerRef };
}
