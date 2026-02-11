/**
 * Utilitários de segurança para validação e sanitização de dados.
 * Previne vulnerabilidades XSS e outras ameaças de segurança.
 */

/**
 * Valida e sanitiza URLs para prevenir ataques XSS via protocolos maliciosos.
 * Apenas permite protocolos seguros: http, https, mailto, tel.
 *
 * @param url - URL a ser validada
 * @returns URL sanitizada se válida, undefined se inválida
 *
 * @example
 * sanitizeUrl('https://example.com') // 'https://example.com'
 * sanitizeUrl('javascript:alert("xss")') // undefined
 * sanitizeUrl('data:text/html,<script>alert("xss")</script>') // undefined
 */
export const sanitizeUrl = (url: string): string | undefined => {
	try {
		const trimmed = url.trim();
		const parsed = new URL(trimmed, window.location.origin);
		const safeProtocols = ["http:", "https:", "mailto:", "tel:"];

		return safeProtocols.includes(parsed.protocol) ? trimmed : undefined;
	} catch {
		// URL inválida (não pode ser parseada)
		return undefined;
	}
};
