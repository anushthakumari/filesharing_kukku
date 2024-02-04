import storage_keys from "../constants/storage_keys";

export const saveUser = (data) => {
	const str = JSON.stringify(data);
	localStorage.setItem(storage_keys.USER, str);
};

export const getUser = () => {
	const userStr = localStorage.getItem(storage_keys.USER);
	if (!userStr) {
		return null;
	}

	return JSON.parse(userStr);
};
