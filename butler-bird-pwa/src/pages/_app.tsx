import { appWithTranslation } from "next-i18next";
import React, { useCallback, useEffect } from "react";
import "styles/index.scss";
import { AppProviders } from "AppProviders";
import { AppProps } from "next/app";
import Head from "next/head";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import smoothscroll from "smoothscroll-polyfill";
import { userIdentification } from "domain/services/userIdentification";
import { LocalStorage } from "domain/util/localStorage";

if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  const handleInstallation = useCallback(async () => {
    const installation = localStorage.getItem(LocalStorage.InstallationV2);
    if (!installation) {
      await userIdentification.init();
    }
  }, []);

  useEffect(() => {
    handleInstallation();
  }, [handleInstallation]);

  return (
    <>
      <Head>
        <title>Butler Bird</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <AppProviders session={pageProps.session} pageProps={pageProps}>
        <Component {...pageProps} />
      </AppProviders>
    </>
  );
}

export default appWithTranslation(App);
