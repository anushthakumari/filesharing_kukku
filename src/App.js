import { Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useAuthState } from "./contexts/AuthProvider";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import FileDetails from "./pages/FileDetails";
import FileView from "./pages/FileView";

function App() {
	const { user } = useAuthState();

	return (
		<GoogleOAuthProvider clientId="448774381681-da8vhof2bai3j18mjpceb7jc0hvmfm1u.apps.googleusercontent.com">
			<Routes>
				<Route exact path="/files/:fileId/view" element={<FileView />} />
				{user ? (
					<>
						<Route exact path="/" element={<Home />} />
						<Route
							exact
							path="/files/:fileId/details"
							element={<FileDetails />}
						/>
					</>
				) : (
					<>
						<Route exact path="/register" element={<Register />} />
						<Route exact path="/login" element={<Login />} />

						<Route exact path="/" element={<Login />} />
					</>
				)}
			</Routes>
		</GoogleOAuthProvider>
	);
}

export default App;
