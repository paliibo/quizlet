import { HomeContextType } from "@/types/types";
import { createContext } from "react";

export const HomeContext = createContext<HomeContextType | null>(null);
