/**
 * Wrapper seguro para localStorage com error handling.
 * Trata casos de QuotaExceededError, modo privado e storage desabilitado.
 */

/**
 * Lê um item do localStorage de forma segura.
 * Trata erros silenciosamente (modo privado, storage desabilitado).
 *
 * @param key - Chave do item no localStorage
 * @returns Valor armazenado ou null se não encontrado/erro
 */
export const safeGetItem = (key: string): string | null => {
	try {
		return localStorage.getItem(key);
	} catch {
		// localStorage não disponível (modo privado, storage desabilitado)
		return null;
	}
};

/**
 * Salva um item no localStorage de forma segura.
 * Trata erros silenciosamente (quota excedida, modo privado).
 *
 * @param key - Chave do item no localStorage
 * @param value - Valor a ser armazenado
 * @returns true se salvou com sucesso, false se houve erro
 */
export const safeSetItem = (key: string, value: string): boolean => {
	try {
		localStorage.setItem(key, value);
		return true;
	} catch {
		// QuotaExceededError, modo privado, ou storage desabilitado
		return false;
	}
};
