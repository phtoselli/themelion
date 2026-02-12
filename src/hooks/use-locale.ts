import type { LocaleKey } from "@client/i18n";
import { defaultLocale, locales } from "@client/i18n";

/**
 * Hook para acessar as traduções do i18n.
 * Retorna o locale padrão (pt-BR).
 */
export const useLocale = () => {
	const currentLocale: LocaleKey = defaultLocale;

	return {
		t: locales[currentLocale],
		locale: currentLocale,
	};
};
