import "@client/styles/modules/empty-state.css";
import type { ReactNode } from "react";

interface EmptyStateContainerProps {
	children: ReactNode;
	className?: string;
}

/**
 * Container reutilizável para estados vazios (not found, sem dados, etc).
 * Centraliza conteúdo vertical e horizontalmente com altura mínima.
 *
 * @param children - Conteúdo a ser exibido (geralmente texto ou ícone)
 * @param className - Classes CSS adicionais (opcional)
 */
export const EmptyStateContainer = ({ children, className = "" }: EmptyStateContainerProps) => {
	return <div className={`empty-state ${className}`.trim()}>{children}</div>;
};
