import { en } from "./locales/en";
import type { Locale } from "./locales/pt-BR";
import { ptBR } from "./locales/pt-BR";

export type LocaleKey = "pt-BR" | "en";

export type { Locale };

export const locales: Record<LocaleKey, Locale> = {
	"pt-BR": ptBR,
	en,
};

export const defaultLocale: LocaleKey = "pt-BR";

export const localeNames: Record<LocaleKey, string> = {
	"pt-BR": "Português (Brasil)",
	en: "English",
};
