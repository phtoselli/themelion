import { Providers } from "@client/app/providers";
import { AppRoutes } from "@client/app/routes";
import { BrowserRouter } from "react-router";

export const App = () => {
	return (
		<BrowserRouter>
			<Providers>
				<AppRoutes />
			</Providers>
		</BrowserRouter>
	);
};
