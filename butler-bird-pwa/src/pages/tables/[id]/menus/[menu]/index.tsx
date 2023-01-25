import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getDefaultPageProps, getServerSideTableProps } from "domain/serverSideProps";
import { MenuCategory } from "components/menu/MenuCategory";
import style from "styles/pages/menu-page.module.scss";
import { MenuHeader } from "components/MenuHeader";
import { Category } from "domain/types/Category";
import { MenuControls } from "components/menu/MenuControls";
import { TagsFilterDialog } from "components/TagsFilterDialog";
import { withMenuProvider } from "components/menu/withMenuProvider";
import { useMenu } from "hooks/useMenu";
import { NavigationDialog, Steps } from "components/NavigationDialog";
import { Session } from "next-auth";
import { getProviders } from "next-auth/client";
import { ProvidersContext } from "context/ProvidersContext";
import { AppProvider } from "next-auth/providers";
import { ItemDialog } from "components/item/ItemDialog";
import { useRouter } from "next/router";
import { paths } from "paths";
import queryString from "querystring";
import { StaffModal } from "components/table/StaffModal";
import { CallStaffResultModal } from "components/CallStaffResultModal";
import { useCallStaff } from "hooks/useCallStaff";
import { Staff } from "domain/types/Modal";
import { CategoryPicker } from "components/menu/CategoryPicker";
import { IconButton } from "components/IconButton";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { scrollToTop } from "domain/util/scroll";
import useWindowScrollPosition from "hooks/useWindowScrollPosition";
import { Banner } from "components/Banner";
import { useBanner } from "hooks/useBanner";

type Props = {
  locale: string;
  session: Session;
  providers: Record<string, AppProvider>;
};

const MenuPage: NextPage<Props> = memo(function MenuPage({ session, providers }) {
  const {
    handleShowNavigation,
    handleClick,
    path,
    customOrderTypes,
    handleCallStaff,
    showModal,
    handleCloseResultModal,
    callStaff,
    showCallStaffOptions,
    handleScrollToTop,
    showScrollToTopButton,
    pathToTable,
    scrollInitiated,
    isOffset,
    showBanner,
    closeBanner,
  } = useMenuPage();

  const renderCategories = useCallback((category: Category) => {
    return <MenuCategory key={category.id} category={category} />;
  }, []);

  const { categoriesList, bannerMessage } = useMenu();

  return (
    <div className={style.root}>
      <div className={style.pageContainer}>
        <ProvidersContext.Provider value={providers}>
          <NavigationDialog session={session} path={path} />
        </ProvidersContext.Provider>
        {pathToTable && (
          <MenuHeader
            onClickMenuButton={handleShowNavigation}
            onClick={handleClick}
            link={pathToTable}
          />
        )}
        {bannerMessage && showBanner && (
          <Banner message={bannerMessage} closeBanner={closeBanner} />
        )}
        <div className={style.container}>
          <CategoryPicker isOffset={isOffset} isScrollInitiated={scrollInitiated} />
          {categoriesList && (
            <MenuControls onCallStaff={callStaff} showCallStaffButton={showCallStaffOptions} />
          )}
          <div className={style.items}>{categoriesList?.map(renderCategories)}</div>
        </div>

        {customOrderTypes && showCallStaffOptions && (
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
        <ItemDialog />
        <TagsFilterDialog />
        {showScrollToTopButton && (
          <IconButton
            onClick={handleScrollToTop}
            className={style.button}
            children={<ArrowForwardIosIcon />}
          />
        )}
      </div>
    </div>
  );
});

function useMenuPage() {
  const { push, query, replace } = useRouter();
  const [showScrollToTopButton, setShowScrollToTopButton] = useState<boolean>(false);
  const { showBanner, closeBanner } = useBanner();

  const showModal = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const path = useMemo(() => {
    const { id: tableId, menu } = query;
    if (!Array.isArray(tableId) && !Array.isArray(menu)) {
      return paths.menus(tableId, menu);
    }
  }, [query]);

  const handleClick = useCallback(() => {
    const { id: tableId } = query;
    if (!Array.isArray(tableId)) {
      push(paths.orderPreview(tableId));
    }
  }, [push, query]);

  const pathToTable = useMemo(() => {
    const { id: tableId } = query;
    if (!Array.isArray(tableId)) {
      return paths.tables(tableId);
    }
  }, [query]);

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

  const { customOrderTypes, handleCallStaff, callStaff } = useCallStaff(
    handleShowStaffModal,
    handleShowResultModal
  );

  const showCallStaffOptions = useMemo(() => {
    return (customOrderTypes && customOrderTypes.length > 0) ?? false;
  }, [customOrderTypes]);

  const handleCloseResultModal = useCallback(() => {
    replace(`${path}`);
  }, [path, replace]);

  const handleScrollToTop = useCallback(() => {
    scrollToTop();
  }, []);

  const { y } = useWindowScrollPosition();

  const [scrollInitiated, setScrollInitiated] = useState(false);

  const initiateScroll = useCallback(() => {
    setScrollInitiated(true);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", initiateScroll);
    return () => {
      window.removeEventListener("scroll", initiateScroll);
    };
  }, [initiateScroll]);

  useEffect(() => {
    if (y > 0) {
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(false);
    }
  }, [y]);

  const [isOffset, setIsOffset] = useState(false);

  useEffect(() => {
    if (y > 50) {
      setIsOffset(true);
    } else {
      setIsOffset(false);
    }
  }, [y]);

  return {
    showModal,
    handleShowNavigation,
    handleClick,
    path,
    customOrderTypes,
    handleCallStaff,
    callStaff,
    handleCloseResultModal,
    showCallStaffOptions,
    handleScrollToTop,
    showScrollToTopButton,
    pathToTable,
    scrollInitiated,
    isOffset,
    showBanner,
    closeBanner,
  };
}

export default withMenuProvider(MenuPage);

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, [
    "common",
    "menu",
    "languages",
    "login",
    "orderPreview",
    "success",
    "table",
  ]);
  await getServerSideTableProps(ctx);
  const providers = await getProviders();
  return {
    props: {
      ...props,
      providers,
    },
  };
}
