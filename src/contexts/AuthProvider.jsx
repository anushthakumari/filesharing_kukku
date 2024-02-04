import React, { createContext, useContext, useState } from "react";

import * as loginUtils from "../utils/login.utils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setuser] = useState(loginUtils.getUser());

	const saveUser = (data) => {
		setuser(data);
		loginUtils.saveUser(data);
	};

	const values = {
		user,
		saveUser,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthState = () => useContext(AuthContext);

export default AuthProvider;
