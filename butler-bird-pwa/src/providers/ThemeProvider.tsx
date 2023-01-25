import React, { createContext, FC, memo, useMemo, useState } from "react";
import {
  ThemeProvider as MaterialThemeProvider,
  createMuiTheme,
  Theme,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { NoSsr } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";

type Props = {};

export enum Style {
  Style1 = "style1",
  Style2 = "style2",
  Style3 = "style3",
  Style4 = "style4",
  Style5 = "style5",
  Style6 = "style6",
}

export interface Palette {
  primary: string;
  secondary: string;
  tertiary: string;
  primaryAlt: string;
  primaryAlt2: string;
  primaryAlt3: string;
}

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

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: FC<Props> = memo(function ThemeProvider({ children }) {
  const { theme, setStyle } = useThemeProvider();

  return (
    <NoSsr>
      <StylesProvider injectFirst>
        <ThemeContext.Provider value={{ theme, setStyle }}>
          <MaterialThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </MaterialThemeProvider>
        </ThemeContext.Provider>
      </StylesProvider>
    </NoSsr>
  );
});

function useThemeProvider() {
  const [style, setStyle] = useState(Style.Style1);

  const theme = useMemo(() => createTheme(style), [style]);

  return { theme, setStyle };
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
  const palette = themeColors[style] ?? themeColors.style1;
  if (typeof window !== "undefined") {
    setColorProps(style);
  }

  return createMuiTheme({
    palette: {
      error: {
        main: "#B00020",
      },
      primary: {
        main: palette.primary,
        contrastText: "#FFFFFF",
        light: palette.secondary,
      },
      secondary: {
        main: "#FFFFFF",
        contrastText: palette.primary,
      },
    },
    typography: {
      fontFamily: ["Cairo", "sans-serif"].join(","),
      h2: {
        fontSize: "2.25rem",
        fontWeight: 600,
        lineHeight: 1.1,
        color: "#404259",
      },
      button: {
        fontSize: "0.875rem",
        fontWeight: 700,
        lineHeight: "1rem",
        textAlign: "center",
        color: "#404259",
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: "1.5rem",
        color: "#404259",
      },
    },
  });
}
