import {
	View,
	Text,
	ScrollView,
	Button,
	ActivityIndicator,
	FlatList,
	Pressable,
} from "react-native";
import React from "react";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useChats } from "@/hooks/useChats";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import ChatItem from "@/components/ChatItem";
import EmptyUI from "@/components/EmptyUI";
import { Chat } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatsTab = () => {
	const router = useRouter();
	const { data: chats, isLoading, error, refetch } = useChats();

	if (isLoading) {
		return (
			<View className="flex-1 bg-surface-DEFAULT items-center justify-center">
				<ActivityIndicator size={"large"} color={"#f2cc8f"} />
			</View>
		);
	}
	if (error) {
		return (
			<View className="flex-1 bg-surface-DEFAULT items-center justify-center">
				<Text className="text-red-500 text-3xl">Failed to load chats</Text>
				<Pressable
					onPress={() => refetch()}
					className="mt-4 px-4 py-2 bg-primary-DEFAULT rounded-lg">
					<Text className="text-surface-dark font-medium">Retry</Text>
				</Pressable>
			</View>
		);
	}

	const handleChatPress = (chat: Chat) => {
		router.push({
			pathname: "/chat/[id]",
			params: {
				id: chat._id,
				participantId: chat.participant._id,
				name: chat.participant.name,
				avatar: chat.participant.avatar,
			},
		});
	};

	return (
		<View className="flex-1 bg-surface-DEFAULT">
			<FlatList
				data={chats}
				renderItem={({ item }) => (
					<ChatItem chat={item} onPress={() => handleChatPress(item)} />
				)}
				keyExtractor={(item) => item._id}
				showsVerticalScrollIndicator={false}
				contentInsetAdjustmentBehavior="automatic"
				contentContainerStyle={{
					paddingHorizontal: 20,
					paddingTop: 16,
					paddingBottom: 24,
				}}
				ListHeaderComponent={<Header />}
				ListEmptyComponent={
					<EmptyUI
						title="No chats yet"
						subtitle="Start a conversation!"
						iconName="chatbubbles-outline"
						iconColor="#6b6b70"
						iconSize={64}
						buttonLabel="New Chat"
						onPressButton={() => router.push("/new-chat")}
					/>
				}
			/>
		</View>
	);
};

export default ChatsTab;

function Header() {
	const router = useRouter();

	return (
		// <SafeAreaView>
			<View className="px-5 pt-2 pb-4">
				<View className="flex-row items-center justify-between">
					<Text className="text-2xl font-bold text-foreground">Chats</Text>
					<Pressable
						className="size-10 bg-primary-DEFAULT rounded-full items-center justify-center"
						onPress={() => router.push("/new-chat")}>
						<Ionicons name="create-outline" size={20} color="#463f3a" />
					</Pressable>
				</View>
			</View>
		// {/* </SafeAreaView> */}
	);
}

// 6:02
