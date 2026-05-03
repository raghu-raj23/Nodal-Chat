import React from "react";
import { Redirect, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@clerk/expo";

const TabsLayout = () => {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) return null;
	if (!isSignedIn) {
		return <Redirect href={"/(auth)"} />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#2b2523",
					borderTopColor: "#1a1a1d",
					borderTopWidth: 1,
					height: 88,
					paddingTop: 8,
				},
				tabBarActiveTintColor: "#f2cc8f",
				tabBarInactiveTintColor: "#6b6b70",
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "600",
				},
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Chats",
					tabBarIcon: ({ color, focused, size }) => (
						<Ionicons
							name={focused ? "chatbubble" : "chatbubble-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused, size }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
