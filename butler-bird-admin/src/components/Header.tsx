import React, {
  FC,
  memo,
  MouseEvent,
  useContext,
  useMemo,
  useState,
} from "react";
import style from "styles/components/Header.module.scss";
import { useOrganization } from "hooks/useOrganization";
import { Button } from "components/Button";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import { ReactComponent as ArrowDropdownIcon } from "assets/icons/arrow-dropdown.svg";
import { UserContext } from "providers/UserProvider";
import { NavLink } from "react-router-dom";
import { paths, withSlug } from "paths";
import { useTranslation } from "react-i18next";
import { I18nextContext } from "providers/I18nextProvider";
import { LanguagePicker } from "components/LanguagePicker";
import classNames from "classnames";

interface Props {}

export const Header: FC<Props> = memo(function Header() {
  const {
    organization,
    handleClose,
    anchorEl,
    handleClick,
    logout,
    languageOptions,
    lng,
    setLng,
    t,
  } = useHeader();

  return (
    <header className={style.container}>
      {organization && (
        <>
          <Button
            variant="text"
            className={style.trigger}
            onClick={handleClick}
            endIcon={<ArrowDropdownIcon />}
          >
            {organization.name}
          </Button>
          <Menu
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            getContentAnchorEl={null}
            anchorEl={anchorEl}
            keepMounted
            open={!!anchorEl}
            onClose={handleClose}
            classes={{ list: style.list }}
          >
            <MenuItem className={style.menuItem}>
              <NavLink
                className={classNames(style.settingsLink)}
                to={withSlug(paths.settings())}
              >
                <Typography>{t("components.header.menu.settings")}</Typography>
              </NavLink>
            </MenuItem>
            <MenuItem className={style.menuItem} onClick={logout}>
              {t("components.header.menu.logout")}
            </MenuItem>
            <MenuItem className={style.languagePicker}>
              <LanguagePicker
                options={languageOptions}
                initial={lng}
                onChange={setLng}
              />
            </MenuItem>
          </Menu>
        </>
      )}
    </header>
  );
});

function useHeader() {
  const organization = useOrganization();
  const { logout } = useContext(UserContext);
  const { t } = useTranslation();
  const { lng, setLng } = useContext(I18nextContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const languageOptions = useMemo(() => {
    return (
      organization?.languages.map((language) => ({
        value: language,
        label: t(`languages.${language}`),
      })) ?? []
    );
  }, [organization?.languages, t]);

  return {
    organization,
    anchorEl,
    handleClose,
    handleClick,
    logout,
    languageOptions,
    lng,
    setLng,
    t,
  };
}
