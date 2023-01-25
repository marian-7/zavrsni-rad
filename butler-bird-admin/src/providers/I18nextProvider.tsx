import { i18n } from "assets/strings/i18n";
import {
  createContext,
  FC,
  memo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { I18nextProvider as Provider } from "react-i18next";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useQuery } from "react-query";
import { organizationService } from "domain/services/organizationService";
import { mapData } from "domain/util/axios";
import { slugPath } from "paths";

type Props = {};

type I18nextContextType = {
  lng: string;
  setLng: (language: string) => void;
};

export const I18nextContext = createContext<I18nextContextType>(
  {} as I18nextContextType
);

export const I18nextProvider: FC<Props> = memo(function I18nextProvider({
  children,
}) {
  const { lng, setLng } = useI18nextProvider();

  return (
    <Provider i18n={i18n}>
      <I18nextContext.Provider value={{ lng, setLng }}>
        {children}
      </I18nextContext.Provider>
    </Provider>
  );
});

function useI18nextProvider() {
  const [lng, setLng] = useState<string>(i18n.language);
  const { pathname } = useLocation();
  const path = matchPath<{ slug: string }>(pathname, slugPath(""));
  const slug = path?.params.slug;
  const { data: organization } = useQuery(
    ["organizations", slug],
    ({ queryKey }) => {
      const [, slug] = queryKey;
      if (slug) {
        return organizationService.getOrganization(slug).then(mapData);
      }
    },
    {
      enabled: !!slug,
    }
  );

  const handleSetLanguage = useCallback(
    (language: string) => i18n.changeLanguage(language),
    []
  );

  useEffect(() => {
    i18n.on("languageChanged", setLng);
  }, []);

  useEffect(() => {
    if (organization && !organization.languages.includes(lng)) {
      i18n.changeLanguage(organization.languages[0] ?? lng);
    }
  }, [lng, organization]);

  return { lng, setLng: handleSetLanguage };
}
