import React, { FC, memo, ReactNode } from "react";
import style from "styles/components/Sidebar.module.scss";
import { SidebarItem } from "components/SidebarItem";
import { ReactComponent as PieChartIcon } from "assets/icons/pie-chart.svg";
import { ReactComponent as ServiceIcon } from "assets/icons/service.svg";
import { ReactComponent as BulletListIcon } from "assets/icons/bullet-list.svg";
import { ReactComponent as CutleryIcon } from "assets/icons/cutlery.svg";
import { ReactComponent as DashboardIcon } from "assets/icons/dashboard.svg";
import { ReactComponent as LocationIcon } from "assets/icons/location.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/settings.svg";
import { ReactComponent as TextIcon } from "assets/icons/text.svg";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";
import { paths, withSlug } from "paths";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mode, Status } from "domain/models/Organization";
import { Drawer, IconButton, Toolbar, useMediaQuery } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useToggleState } from "hooks/useToggleState";
import { ReactComponent as PrinterIcon } from "assets/icons/printer-alt.svg";

interface Item {
  to: string;
  icon: ReactNode;
  label: string;
}

interface Props {
  isStaffMember: boolean;
  organizationStatus: Status;
  mode: Mode;
}

export const Sidebar: FC<Props> = memo(function Sidebar(props) {
  const { items, tablet, drawerOpen, toggleDrawer } = useSidebar(props);

  function renderItem(item: Item) {
    return <SidebarItem key={item.to} onItemClick={toggleDrawer} {...item} />;
  }

  function renderTabletMenu() {
    return (
      <Toolbar className={style.toolbar} variant="dense">
        <IconButton onClick={toggleDrawer} className={style.menuIcon}>
          <MenuIcon />
        </IconButton>
        <Drawer
          open={drawerOpen}
          anchor="left"
          onClose={toggleDrawer}
          classes={{ paper: style.paper }}
        >
          <IconButton onClick={toggleDrawer} className={style.close}>
            <CloseIcon />
          </IconButton>
          {items.map(renderItem)}
        </Drawer>
      </Toolbar>
    );
  }

  function renderDesktopMenu() {
    return <aside className={style.container}>{items.map(renderItem)}</aside>;
  }

  return tablet ? renderTabletMenu() : renderDesktopMenu();
});

function useSidebar({ isStaffMember, organizationStatus, mode }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [drawerOpen, toggleDrawer] = useToggleState(false, [true, false]);
  const tablet = useMediaQuery("(max-width:1024px)");

  const items = [];

  if (organizationStatus === Status.Premium && !isStaffMember) {
    items.push({
      to: withSlug(paths.dashboard()),
      icon: <PieChartIcon />,
      label: t("sidebar.dashboard"),
    });
  }

  if (mode !== Mode.View) {
    items.push({
      to: withSlug(paths.orders()),
      icon: <ServiceIcon />,
      label: t("sidebar.orders"),
    });
  }

  if (!isStaffMember) {
    items.push(
      { to: paths.menus(slug), icon: <TextIcon />, label: t("sidebar.menus") },

      {
        to: paths.categories(slug),
        icon: <DashboardIcon />,
        label: t("sidebar.categories"),
      },
      {
        to: withSlug(paths.items()),
        icon: <BulletListIcon />,
        label: t("sidebar.items"),
      },
      {
        to: withSlug(paths.locations()),
        icon: <LocationIcon />,
        label: t("sidebar.locations"),
      },
      {
        to: withSlug(paths.venues()),
        icon: <CutleryIcon />,
        label: t("sidebar.venues"),
      },
      {
        to: withSlug(paths.printers()),
        icon: <PrinterIcon className={style.icon} />,
        label: t("sidebar.printers"),
      },
      {
        to: withSlug(paths.settings()),
        icon: <SettingsIcon />,
        label: t("sidebar.settings"),
      }
    );
  }

  return { items, tablet, drawerOpen, toggleDrawer };
}
