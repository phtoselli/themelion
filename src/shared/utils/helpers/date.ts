/**
 * Formata data ISO 8601 para formato brasileiro (DD/MM/AAAA).
 *
 * @param isoDate - Data no formato ISO 8601 (ex: "2024-01-15T10:30:00Z")
 * @param locale - Locale para formatação (padrão: "pt-BR")
 * @returns Data formatada (ex: "15/01/2024")
 *
 * @example
 * formatDatePtBR("2024-01-15T10:30:00Z") // "15/01/2024"
 */
export const formatDatePtBR = (isoDate: string, locale = "pt-BR"): string => {
	return new Date(isoDate).toLocaleDateString(locale, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};
