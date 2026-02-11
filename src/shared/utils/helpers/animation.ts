import { ANIMATION_STAGGER_MAX } from "@client/shared/constants/timing";

/**
 * Gera classe CSS para stagger animation com limite máximo.
 * Evita criar classes Tailwind inválidas para índices muito altos.
 *
 * @param index - Índice do elemento na lista (0-based)
 * @param max - Máximo de níveis de stagger (padrão: ANIMATION_STAGGER_MAX)
 * @returns Classe CSS no formato "stagger-N"
 *
 * @example
 * getStaggerClass(0)  // "stagger-1"
 * getStaggerClass(5)  // "stagger-6"
 * getStaggerClass(15) // "stagger-10" (limitado ao max)
 */
export const getStaggerClass = (index: number, max = ANIMATION_STAGGER_MAX): string => {
	return `stagger-${Math.min(index + 1, max)}`;
};
