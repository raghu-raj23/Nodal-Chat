import { useApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";

export const useAuthCallback = () => {
	const { apiWithAuth } = useApi();

	return useMutation({
		mutationFn: async () => {
			const { data } = await apiWithAuth<User>({
				method: "POST",
				url: "/auth/callback",
			});
			return data;
		},
	});
};
