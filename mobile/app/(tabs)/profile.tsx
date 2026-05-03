import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@clerk/expo";

const ProfileTab = () => {
	const { signOut } = useAuth();
	return (
		<ScrollView
			className="bg-surface-DEFAULT"
			contentInsetAdjustmentBehavior="automatic">
			<Text className="text-foreground">Profile Tab</Text>
			<Pressable
				onPress={() => signOut()}
				className="mt-5 bg-red-300 px-4 py-4 rounded-lg">
				<Text>Sign out</Text>
			</Pressable>
		</ScrollView>
	);
};

export default ProfileTab;
