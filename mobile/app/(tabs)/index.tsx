import { View, Text, ScrollView, Button } from "react-native";
import React from "react";
import * as Sentry from "@sentry/react-native";

const ChatsTab = () => {
	return (
		<ScrollView
			className="bg-surface-DEFAULT"
			contentInsetAdjustmentBehavior="automatic">
			<Text className="text-foreground">Chats Tab</Text>
			<Button
				title="Try!"
				onPress={() => {
					Sentry.captureException(new Error("First error"));
				}}
			/>
		</ScrollView>
	);
};

export default ChatsTab;
