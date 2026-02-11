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
	return (
		<div className={`flex items-center justify-center min-h-[400px] ${className}`.trim()}>
			{children}
		</div>
	);
};
