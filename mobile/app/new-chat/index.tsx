import {
	View,
	Text,
	Pressable,
	TextInput,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { useUsers } from "@/hooks/useUsers";
import { useGetorCreateChat } from "@/hooks/useChats";
import { User } from "@/types";
import UserItem from "@/components/UserItem";

const NewChatScreen = () => {
	const [searchQuery, setSearchQuery] = React.useState("");
	const { data: allUsers, isLoading, error } = useUsers();
	const { mutate: getOrCreateChat, isPending: isCreatingChat } =
		useGetorCreateChat();

	const filteredUsers = allUsers?.filter((u) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		return (
			u.name.toLowerCase().includes(query) ||
			u.email.toLowerCase().includes(query)
		);
	});

	const handleUserSelect = (user: User) => {
		getOrCreateChat(user._id, {
			onSuccess: (chat) => {
				router.dismiss();
				setTimeout(() => {
					router.push({
						pathname: "/chat/[id]",
						params: {
							id: chat._id,
							participantId: chat.participant._id,
							name: chat.participant.name,
							avatar: chat.participant.avatar,
						},
					});
				}, 100);
			},
		});
	};

	return (
		<SafeAreaView
			className="flex-1 bg-black"
			style={{ backgroundColor: "black" }}
			edges={["top", "bottom"]}>
			<View className="bg-black/40 justify-end">
				<View className="bg-surface-DEFAULT rounded-t-3xl h-[95%] overflow-hidden">
					<View className="px-5 pt-3 pb-3 bg-surface border-b border-surface-light flex-row items-center">
						<Pressable
							className="w-9 h-9 rounded-full items-center justify-center mr-2 bg-surface-card"
							onPress={() => router.back()}>
							<Ionicons name="close" size={20} color="#F4A261" />
						</Pressable>
						<View className="flex-1">
							<Text className="text-foreground text-xl font-semibold">
								New chat
							</Text>
							<Text className="text-muted-foreground text-xs mt-0.5">
								Search for a user to start chatting
							</Text>
						</View>
					</View>
					<View className="px-5 pt-3 pb-2 bg-surface">
						<View className="flex-row items-center bg-surface-card rounded-full px-3 py-1.5 gap-2 border border-surface-light">
							<Ionicons name="search" size={18} color="#6B6B70" />
							<TextInput
								placeholder="Search users"
								placeholderTextColor="#6B6B70"
								className="flex-1 text-foreground text-sm"
								value={searchQuery}
								onChangeText={setSearchQuery}
								autoCapitalize="none"
							/>
						</View>
					</View>

					<View className="flex-1 bg-surface-DEFAULT">
						{isCreatingChat || isLoading ? (
							<ActivityIndicator
								size="large"
								color="#F4A261"
								className="mt-5"
							/>
						) : !filteredUsers || filteredUsers.length === 0 ? (
							<Text className="text-muted-foreground text-center mt-5">
								No users found.
							</Text>
						) : (
							<ScrollView
								className="flex-1 px-5 pt-4"
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{ paddingBottom: 24 }}>
								<Text className="text-muted-foreground text-xs">USERS</Text>
								{filteredUsers.map((user) => (
									<UserItem
										key={user._id}
										user={user}
										isOnline={true}
										onPress={() => handleUserSelect(user)}
									/>
								))}
							</ScrollView>
						)}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default NewChatScreen;
