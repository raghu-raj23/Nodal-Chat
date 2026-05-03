import { View, Text, ScrollView } from "react-native";
import React from "react";

const ChatsTab = () => {
	return (
		<ScrollView
			className="bg-surface-DEFAULT"
			contentInsetAdjustmentBehavior="automatic">
			<Text className="text-foreground">Chats Tab</Text>
		</ScrollView>
	);
};

export default ChatsTab;
