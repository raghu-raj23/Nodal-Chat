import { Stack } from "expo-router";
import "../global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthSync from "@/components/AuthSync";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export default function RootLayout() {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<QueryClientProvider client={queryClient}>
				<AuthSync />
				<StatusBar style="light" />
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: "#352f2d" },
					}}>
					<Stack.Screen name="(auth)" options={{ animation: "fade" }} />
					<Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
				</Stack>
			</QueryClientProvider>
		</ClerkProvider>
	);
}
