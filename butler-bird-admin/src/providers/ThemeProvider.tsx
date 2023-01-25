import { createContext, FC, memo, useEffect, useMemo, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  Theme,
  createMuiTheme,
} from "@material-ui/core";
import { Style } from "domain/models/Organization";
import { useOrganizationQuery } from "hooks/useOrganizationQuery";
import { Snackbar } from "components/Snackbar";

export interface Palette {
  primary: string;
  secondary: string;
  tertiary: string;
  primaryAlt: string;
  primaryAlt2: string;
  primaryAlt3: string;
}

type Props = {};

export const themeColors: Record<Style, Palette> = {
  [Style.Style1]: {
    primary: "#42399d",
    secondary: "#EAEDFA",
    tertiary: "#F7F8FD",
    primaryAlt: "#583FA6",
    primaryAlt2: "#563EA5",
    primaryAlt3: "#323597",
  },
  [Style.Style2]: {
    primary: "#AF0404",
    secondary: "#FAECEC",
    tertiary: "#FFF7F7",
    primaryAlt: "#CA2929",
    primaryAlt2: "#A41414",
    primaryAlt3: "#7B1717",
  },
  [Style.Style3]: {
    primary: "#014EA8",
    secondary: "#E4F1FF",
    tertiary: "#F4F9FF",
    primaryAlt: "#15587E",
    primaryAlt2: "#174A97",
    primaryAlt3: "#0C2271",
  },
  [Style.Style4]: {
    primary: "#263448",
    secondary: "#E2E2E2",
    tertiary: "#F2F2F2",
    primaryAlt: "#38444A",
    primaryAlt2: "#2A3038",
    primaryAlt3: "#101527",
  },
  [Style.Style5]: {
    primary: "#004F29",
    secondary: "#D0E9DD",
    tertiary: "#F2F9F6",
    primaryAlt: "#385849",
    primaryAlt2: "#2C4439",
    primaryAlt3: "#0C3622",
  },
  [Style.Style6]: {
    primary: "#B19B27",
    secondary: "#F4F0D8",
    tertiary: "#FBF9F1",
    primaryAlt: "#8D8456",
    primaryAlt2: "#8B7E38",
    primaryAlt3: "#62540D",
  },
};

type ThemeContextType = {
  theme: Theme;
  setStyle: (style: Style) => void;
};

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

export const ThemeProvider: FC<Props> = memo(function ThemeProvider({
  children,
}) {
  const { theme, setStyle, organization } = useThemeProvider();

  return (
    <ThemeContext.Provider value={{ theme, setStyle }}>
      <MuiThemeProvider theme={theme}>
        {organization ? children : <></>}
        <Snackbar />
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
});

function useThemeProvider() {
  const { data: organization } = useOrganizationQuery();
  const orgStyle = organization?.style;
  const [style, setStyle] = useState(orgStyle ?? Style.Style1);

  const theme = useMemo(() => createTheme(style), [style]);

  useEffect(() => {
    if (orgStyle) {
      setStyle(orgStyle);
    }
  }, [orgStyle]);

  return { theme, setStyle, organization };
}

function setColorProps(style: Style) {
  const palette = themeColors[style];
  const root = document.documentElement;
  root.style.setProperty("--primary-color", palette.primary);
  root.style.setProperty("--primary-color-alt", palette.primaryAlt);
  root.style.setProperty("--primary-color-alt2", palette.primaryAlt2);
  root.style.setProperty("--primary-color-alt3", palette.primaryAlt3);
  root.style.setProperty("--secondary-color", palette.secondary);
  root.style.setProperty("--tertiary-color", palette.tertiary);
}

function createTheme(style: Style) {
  const palette = themeColors[style];
  setColorProps(style);

  return createMuiTheme({
    overrides: {
      MuiCheckbox: {
        colorSecondary: {
          color: "#404259",
          "&$checked": { color: palette.primary },
        },
      },
      MuiButton: {
        text: {
          color: "#404259",
        },
        contained: {
          backgroundColor: palette.secondary,
          color: "#404259",
        },
        containedPrimary: {
          color: "#ffffff",
          boxShadow: "0 2px 6px rgba(#404259, 0.21)",
          fontWeight: 500,
        },
      },
    },
    typography: {
      htmlFontSize: 16,
      fontFamily: ["Cairo", "sans-serif"].join(","),
      h2: {
        fontWeight: 600,
        fontSize: "2.25rem",
        lineHeight: "3.375rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: "2.25rem",
      },
      h4: {
        fontSize: "1.125rem",
        lineHeight: "1.75rem",
      },
      body1: {
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: "1.5rem",
        color: "#404259",
      },
      body2: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontWeight: 400,
        fontSize: "0.75rem",
        lineHeight: "0.75rem",
      },
      button: {
        fontWeight: 700,
        fontSize: "0.875rem",
        lineHeight: "1rem",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        textAlign: "center",
      },
      caption: {
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: "1.5rem",
        color: "#404259",
      },
    },
    palette: {
      primary: {
        main: palette.primary ?? themeColors.style1.primary,
      },
      secondary: {
        main: palette.secondary ?? themeColors.style1.secondary,
      },
      error: {
        main: "#B00020",
        light: "#D62646",
      },
    },
  });
}
