import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import da from "assets/strings/locals/da.json";
import de from "assets/strings/locals/de.json";
import en from "assets/strings/locals/en.json";
import es from "assets/strings/locals/es.json";
import fr from "assets/strings/locals/fr.json";
import hr from "assets/strings/locals/hr.json";

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources: { en, de, da, es, fr, hr },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export { i18n };
