import {
	View,
	Text,
	Dimensions,
	Pressable,
	ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import useAuthSocial from "@/hooks/useSocialAuth";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedOrb } from "@/components/AnimatedOrb";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
	const { handleSocialAuth, loadingStrategy } = useAuthSocial();
	return (
		<View className="flex-1 bg-surface-dark">
			<View className="absolute inset-0 overflow-hidden">
				<LinearGradient
					colors={["#160a08", "#57302a"]}
					style={{ position: "absolute", width: "100%", height: "100%" }}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				/>
				<AnimatedOrb
					colors={["#F4A261", "#E76F51"]}
					size={300}
					initialX={-80}
					initialY={height * 0.1}
					duration={4000}
				/>
				<AnimatedOrb
					colors={["#E76F51", "#F4A261"]}
					size={250}
					initialX={width - 100}
					initialY={height * 0.3}
					duration={5000}
				/>
				<AnimatedOrb
					colors={["#FFD7BA", "#F4A261"]}
					size={200}
					initialX={width * 0.3}
					initialY={height * 0.6}
					duration={3500}
				/>
				<AnimatedOrb
					colors={["#F4B183", "#E76F51"]}
					size={180}
					initialX={-50}
					initialY={height * 0.75}
					duration={4500}
				/>
				<BlurView
					intensity={70}
					tint="dark"
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
					}}
				/>
			</View>

			<SafeAreaView className="items-center justify-between flex-1 gap-10">
				<View className="items-center pt-10">
					<Image
						source={require("../../assets/images/logo.png")}
						style={{ width: 100, height: 100, marginVertical: -20 }}
						contentFit="contain"
					/>
					<Text className="text-4xl font-bold text-primary-DEFAULT font-serif tracking-wider uppercase">
						Nodal Chat
					</Text>
				</View>

				<View className="justify-center items-center">
					<Image
						source={require("../../assets/images/auth.png")}
						style={{
							width: width - 48,
							height: height * 0.3,
						}}
						contentFit="contain"
					/>
				</View>
				<View className="mt-6 items-center">
					<Text className="text-5xl font-bold text-foreground text-center font-serif">
						Connecting Nodes
					</Text>
					<Text className="text-primary-DEFAULT text-center mt-4 text-3xl font-mono">
						Together!
					</Text>
				</View>
				<View className="flex-row gap-4 mt-10 px-4">
					<Pressable
						className="flex-1 flex-row items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
						disabled={loadingStrategy === "oauth_google"}
						onPress={() => {
							handleSocialAuth("oauth_google");
						}}>
						{loadingStrategy === "oauth_google" ? (
							<ActivityIndicator />
						) : (
							<>
								<Image
									source={require("../../assets/images/google.png")}
									style={{ width: 20, height: 20 }}
								/>
								<Text className="text-primary-soft">Google</Text>
							</>
						)}
					</Pressable>
					<Pressable
						className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl border border-white/20 active:scale-[0.97]"
						disabled={loadingStrategy === "oauth_apple"}
						onPress={() => {
							handleSocialAuth("oauth_apple");
						}}>
						{loadingStrategy === "oauth_apple" ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<>
								<Ionicons name="logo-apple" size={20} color="#FFFFFF" />
								<Text className="text-primary">Apple</Text>
							</>
						)}
					</Pressable>
					<Pressable
						className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl border border-white/20 active:scale-[0.97]"
						disabled={loadingStrategy === "oauth_github"}
						onPress={() => {
							handleSocialAuth("oauth_github");
						}}>
						{loadingStrategy === "oauth_github" ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<>
								<Ionicons name="logo-github" size={20} color="#FFFFFF" />
								<Text className="text-primary">GitHub</Text>
							</>
						)}
					</Pressable>
				</View>
			</SafeAreaView>
		</View>
	);
};

export default AuthScreen;
