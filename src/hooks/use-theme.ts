import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "themelion:theme";

/**
 * Hook para gerenciar o tema da aplicação (dark/light)
 * Persiste a preferência no localStorage
 */
export const useTheme = () => {
	// Inicializa com o tema salvo ou dark como padrão
	const [theme, setThemeState] = useState<Theme>(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved === "light" || saved === "dark" ? saved : "dark";
	});

	// Aplica a classe no documento e salva no localStorage
	useEffect(() => {
		const root = document.documentElement;

		// Remove ambas as classes primeiro
		root.classList.remove("dark", "light");

		// Adiciona a classe do tema atual
		root.classList.add(theme);

		// Persiste no localStorage
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
	};

	const toggleTheme = () => {
		setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return { theme, setTheme, toggleTheme };
};
