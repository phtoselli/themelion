import { Providers } from "@client/app/providers";
import { AppRoutes } from "@client/app/routes";
import { useTheme } from "@client/hooks/use-theme";
import { BrowserRouter } from "react-router";

export const App = () => {
	// Inicializa o tema (aplica dark ou light no <html>)
	useTheme();

	return (
		<BrowserRouter>
			<Providers>
				<AppRoutes />
			</Providers>
		</BrowserRouter>
	);
};
