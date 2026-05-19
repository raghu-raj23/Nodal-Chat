import { View, Text, Pressable } from "react-native";
import React from "react";
import { Chat } from "@/types";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, onPress }: { chat: Chat; onPress: () => void }) => {
	const participant = chat.participant;
	const isOnline = true;
	const isTyping = false;
	const hasUnread = false;

	return (
		<Pressable
			onPress={onPress}
			className="flex-row items-center py-3 active:opacity-70">
			<View className="relative">
				<Image
					source={participant.avatar}
					style={{ width: 56, height: 56, borderRadius: 999 }}
				/>
				{isOnline && (
					<View className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-2 border-surface-DEFAULT" />
				)}
			</View>
			<View className="flex-1 ml-4">
				<View className="flex-row items-center justify-center">
					<Text
						className={`text-base font-medium ${hasUnread ? "text-primary-DEFAULT" : "text-foreground"}`}>
						{participant.name}
					</Text>
					<View className="flex-row items-center gap-2">
						{hasUnread && (
							<View className="size-2 bg-primary-DEFAULT rounded-full" />
						)}
						<Text className="text-xs text-subtle-foreground">
							{chat.lastMessageAt
								? formatDistanceToNow(new Date(chat.lastMessageAt), {
										addSuffix: false,
									})
								: ""}
						</Text>
					</View>
					<View className="flex-row items-center justify-between"></View>
				</View>
				<View className="flex-row items-center justify-between mt-1">
					{isTyping ? (
						<Text className="text-sm text-muted-foreground">Typing...</Text>
					) : (
						<Text
							className={`text-sm flex-1 mr-3 ${hasUnread ? "text-foreground font-medium" : "text-subtle-foreground"}`}
							numberOfLines={1}>
							{chat.lastMessage?.text || "No messages yet"}
						</Text>
					)}
				</View>
			</View>
		</Pressable>
	);
};

export default ChatItem;
