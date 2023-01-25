import { getSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { compose } from "domain/util/compose";
import { GetServerSidePropsContext } from "next";
import { paths } from "paths";
import { QueryClient } from "react-query";
import { getTableById } from "domain/services/tableService";
import { Cookies, getCookieValueByOrganizationId } from "domain/util/cookies";
import { getUserAddresses } from "domain/services/userService";
import { dehydrate } from "react-query/hydration";

export function getUser(redirect = false) {
  return async function (ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx);
    if (redirect) {
      if (ctx.res && !session && ctx.resolvedUrl !== paths.root()) {
        ctx.res.writeHead(302, { Location: paths.root() });
        ctx.res.end();
      }
    }
    return { session };
  };
}

export function getAddressList() {
  return async function (ctx: GetServerSidePropsContext) {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery("locations", async () => {
      const session = await getSession(ctx);
      if (session) {
        const res = await getUserAddresses(session?.accessToken);
        return {
          addresses: res.data,
        };
      } else {
        return null;
      }
    });

    return {
      dehydratedState: dehydrate(queryClient),
    };
  };
}

export function getTranslations(namespaces: string[]) {
  return function (ctx: GetServerSidePropsContext) {
    if (ctx.locale) {
      return serverSideTranslations(ctx.locale, namespaces);
    }
  };
}

export async function getServerSideTableProps(ctx: GetServerSidePropsContext) {
  const id = ctx.params?.id;
  if (typeof id !== "string") {
    return {
      props: {},
    };
  }
  const queryClient = new QueryClient();

  const table = await queryClient.fetchQuery(["table", id], async () => {
    try {
      const res = await getTableById(id);
      return res.data;
    } catch (error) {
      ctx.res.writeHead(302, { Location: `${paths.root()}?error=true` });
      ctx.res.end();
    }
  });

  if (!table) {
    return {
      props: {},
    };
  }

  let lang;

  const locale = ctx.locale;

  const languageFromCookie = getCookieValueByOrganizationId(
    table.organization,
    Cookies.Language,
    ctx
  );

  if (languageFromCookie === locale && table.languages.includes(locale!)) {
    lang = locale;
  } else if (table.languages.includes(languageFromCookie)) {
    lang = languageFromCookie;
  } else {
    lang = table.languages[0];
  }

  const url = `/${lang}${ctx.resolvedUrl}`;

  if (ctx.locale === lang) {
    return {
      props: {},
    };
  }

  ctx.res.writeHead(302, { Location: url });
  ctx.res.end();
}

export async function getDefaultPageProps(
  ctx: GetServerSidePropsContext,
  namespaces: string[],
  redirect?: boolean
) {
  return compose(getTranslations(namespaces), getUser(redirect), getAddressList())(ctx);
}

export async function redirectToLogin(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  if (ctx.res && !session && ctx.query.id && !Array.isArray(ctx.query.id)) {
    ctx.res.writeHead(302, { Location: paths.loginOnTable(ctx.query.id) });
    ctx.res.end();
  }
}
