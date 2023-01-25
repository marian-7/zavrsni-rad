import { createContext } from "react";
import { AppProvider } from "next-auth/providers";

export const ProvidersContext = createContext<Record<string, AppProvider>>({});
