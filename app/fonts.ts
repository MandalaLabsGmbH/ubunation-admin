import { Chakra_Petch, Inter, Inter_Tight } from "next/font/google"; 


export const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: "700"
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});