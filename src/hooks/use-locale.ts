import type { LocaleKey } from "@client/i18n";
import { defaultLocale, locales } from "@client/i18n";

/**
 * Hook para acessar as traduções do i18n.
 * Por enquanto retorna o locale padrão (pt-BR).
 * No futuro, pode ser conectado a um contexto para permitir troca de idioma.
 */
export const useLocale = () => {
	// Por enquanto, sempre retorna pt-BR
	// No futuro, isso pode vir de um contexto/localStorage
	const currentLocale: LocaleKey = defaultLocale;

	return {
		t: locales[currentLocale],
		locale: currentLocale,
	};
};
