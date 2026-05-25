import { Stack } from "expo-router";
import "../global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthSync from "@/components/AuthSync";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import SocketConnection from "@/components/SocketConnections";

Sentry.init({
	dsn: "https://3c6282a0dc0eec116e61ec5a1f25e5ad@o4511368817868800.ingest.de.sentry.io/4511368827633744",

	// Adds more context data to events (IP address, cookies, user, etc.)
	// For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
	sendDefaultPii: true,

	// Enable Logs
	enableLogs: true,

	// Configure Session Replay
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [
		Sentry.mobileReplayIntegration(),
		Sentry.reactNativeTracingIntegration({
			traceFetch: true,
			traceXHR: true,
			enableHTTPTimings: true,
		}),
	],

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
});

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export default Sentry.wrap(function RootLayout() {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<QueryClientProvider client={queryClient}>
				<AuthSync />
				<SocketConnection />
				<StatusBar style="light" />
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: "#352f2d" },
					}}>
					<Stack.Screen name="(auth)" options={{ animation: "fade" }} />
					<Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
					<Stack.Screen
						name="new-chat"
						options={{
							animation: "slide_from_bottom",
							presentation: "modal",
							gestureEnabled: true,
						}}
					/>
				</Stack>
			</QueryClientProvider>
		</ClerkProvider>
	);
});
