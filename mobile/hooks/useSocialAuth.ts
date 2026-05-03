import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

function useAuthSocial() {
	const [loadingStrategy, setLoadingStrategy] = useState<
		"oauth_google" | "oauth_apple" | null
	>(null);
	const { startSSOFlow } = useSSO();
	const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
		if (loadingStrategy) return;
		setLoadingStrategy(strategy);

		try {
			const { createdSessionId, setActive } = await startSSOFlow({ strategy });
			if (createdSessionId && setActive) {
				await setActive({ session: createdSessionId });
			}
		} catch (error) {
			console.error("Error occurred while starting SSO flow:", error);
			Alert.alert(
				"Authentication Error",
				"An error occurred during social authentication. Please try again.",
			);
		} finally {
			setLoadingStrategy(null);
		}
	};
	return {
		handleSocialAuth,
		loadingStrategy,
	};
}

export default useAuthSocial;
