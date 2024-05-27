import { HomeContextType } from "@/types/context";
import { createContext } from "react";

export const HomeContext = createContext<HomeContextType | null>(null);
