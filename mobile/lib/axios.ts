import { useAuth } from "@clerk/expo";
import { create } from "axios";
import { useEffect } from "react";

const API_URL = "https://nodal-chat.onrender.com/api";

const api = create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const useApi = () => {
	const { getToken } = useAuth();

	useEffect(() => {
		const requestIterceptor = api.interceptors.request.use(async (config) => {
			const token = await getToken();

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			return config;
		});
		// Cleanup: remove interceptors when component unmounts
		return () => {
			api.interceptors.request.eject(requestIterceptor);
		};
	}, [getToken]);
	return api;
};
