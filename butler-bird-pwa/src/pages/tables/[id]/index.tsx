import React, { memo, useCallback, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";
import { MenuListItem } from "components/table/MenuListItem";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import style from "styles/pages/table-page.module.scss";
import { Button } from "components/Button";
import { getDefaultPageProps, getServerSideTableProps } from "domain/serverSideProps";
import { Header } from "components/Header";
import { Menu as MenuType } from "domain/types/Menu";
import { StaffModal } from "components/table/StaffModal";
import { useTable } from "hooks/useTable";
import { NavigationDialog, Steps } from "components/NavigationDialog";
import { CurrencyProvider } from "providers/CurrencyProvider";
import { useCallStaff } from "hooks/useCallStaff";
import { CallStaffResultModal } from "components/CallStaffResultModal";
import { getProviders } from "next-auth/client";
import { AppProvider } from "next-auth/providers";
import { ProvidersContext } from "context/ProvidersContext";
import { paths } from "paths";
import queryString from "querystring";
import { useRouter } from "next/router";
import { Staff } from "domain/types/Modal";
import { useOrder } from "hooks/useOrder";
import { OrganizationMode } from "domain/types/Organization";
import { Banner } from "components/Banner";
import { useBanner } from "hooks/useBanner";

type Props = {
  session: Session;
  locale: string;
  providers: Record<string, AppProvider>;
};

const TablePage: NextPage<Props> = memo(function TablePage({ session, providers }) {
  const {
    menus,
    customOrderTypes,
    showModal,
    handleShowNavigation,
    logo,
    callStaff,
    handleCallStaff,
    path,
    handleCloseResultModal,
    id,
    order,
    goToOrderPreview,
    showDescription,
    bannerMessage,
    closeBanner,
    showBanner,
  } = useTablePage();
  const { t } = useTranslation("table");

  const renderMenu = useCallback((menu: MenuType) => {
    return <MenuListItem key={menu.id} menu={menu} />;
  }, []);

  return (
    <>
      <CurrencyProvider>
        <div className={style.tablePage}>
          <div className={style.container}>
            <Header
              menu
              onClickMenuButton={handleShowNavigation}
              containerClassName={style.header}
              shoppingCart
              orderCount={order?.items.length}
              goToOrderPreview={goToOrderPreview}
            />
            {bannerMessage && showBanner && (
              <Banner message={bannerMessage} closeBanner={closeBanner} />
            )}
            <ProvidersContext.Provider value={providers}>
              <NavigationDialog session={session} path={path} />
            </ProvidersContext.Provider>
            <img src={logo} className={style.logo} />
            {!showDescription && <Typography className="mb-3">{t("info", { id })}</Typography>}
            <div className={style.menuOptions}>{menus?.map(renderMenu)}</div>
          </div>
          {customOrderTypes && customOrderTypes.length > 0 && (
            <div className={style.btn}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={callStaff}
                className={style.callStaff}
              >
                {t("button.callStaff")}
              </Button>
            </div>
          )}
          {customOrderTypes && customOrderTypes.length > 0 && (
            <StaffModal
              customOrderTypes={customOrderTypes}
              isOpen={showModal === Staff.Show}
              onCallStaff={handleCallStaff}
            />
          )}
          <CallStaffResultModal
            isOpen={showModal === Staff.Success}
            onClose={handleCloseResultModal}
          />
        </div>
      </CurrencyProvider>
    </>
  );
});

function useTablePage() {
  const { push, query, replace } = useRouter();

  const { table, logo, bannerMessage } = useTable();
  const { showBanner, closeBanner } = useBanner();

  const { order } = useOrder();

  const showDescription = useMemo(() => {
    return table?.mode === OrganizationMode.Order;
  }, [table?.mode]);

  const showModal = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const id = useMemo(() => {
    return table?.id;
  }, [table?.id]);

  const menus = useMemo(() => {
    return table?.menus;
  }, [table?.menus]);

  const path = useMemo(() => {
    if (table) {
      return paths.tables(table.id);
    }
  }, [table]);

  const handleShowNavigation = useCallback(() => {
    if (path) {
      push(`${path}?${queryString.stringify({ modal: Steps.Initial })}`);
    }
  }, [path, push]);

  const handleShowStaffModal = useCallback(() => {
    push(`${path}?${queryString.stringify({ modal: Staff.Show })}`);
  }, [path, push]);

  const handleShowResultModal = useCallback(() => {
    push(`${path}?${queryString.stringify({ modal: Staff.Success })}`);
  }, [path, push]);

  const handleCloseResultModal = useCallback(() => {
    replace(`${path}`);
  }, [path, replace]);

  const { customOrderTypes, handleCallStaff, callStaff } = useCallStaff(
    handleShowStaffModal,
    handleShowResultModal
  );

  const goToOrderPreview = useCallback(() => {
    push(paths.orderPreview(id));
  }, [id, push]);

  return {
    menus,
    handleCallStaff,
    customOrderTypes,
    showModal,
    handleShowNavigation,
    logo,
    callStaff,
    handleShowResultModal,
    path,
    handleCloseResultModal,
    id,
    order,
    goToOrderPreview,
    showDescription,
    bannerMessage,
    showBanner,
    closeBanner,
  };
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, [
    "common",
    "table",
    "languages",
    "login",
    "orderPreview",
    "success",
  ]);
  const providers = await getProviders();
  const tableProps = await getServerSideTableProps(ctx);
  if (tableProps) {
    return {
      props: {
        ...props,
        providers,
      },
    };
  }
}

export default TablePage;
