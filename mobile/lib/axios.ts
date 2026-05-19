import { useAuth } from "@clerk/expo";
import { create } from "axios";
import { useEffect } from "react";
import * as Sentry from "@sentry/react-native";

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

		const responseInterceptor = api.interceptors.response.use(
			(response) => response,
			(error) => {
				// Log api errors to Sentry
				if (error.response) {
					// Server responded with a status other than 2xx
					Sentry.logger.error(
						Sentry.logger
							.fmt`API request failed: ${error.config.method.toUpperCase()} ${error.config?.url}`,
						{
							status: error.response.status,
							endpoint: error.config.url,
							method: error.config.method,
						},
					);
				} else if (error.request) {
					// Request was made but no response received
					Sentry.logger.warn(
						Sentry.logger.fmt`API Error: No response received`,
						{
							endpoint: error.config.url,
							method: error.config.method,
						},
					);
				} else {
					return Promise.reject(error);
				}
			},
		);
		// Cleanup: remove interceptors when component unmounts
		return () => {
			api.interceptors.request.eject(requestIterceptor);
			api.interceptors.response.eject(responseInterceptor);
		};
	}, [getToken]);
	return api;
};
