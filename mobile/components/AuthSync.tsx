import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";

const AuthSync = () => {
	const { isSignedIn } = useAuth();
	const { user } = useUser();
	const { mutate: syncUser } = useAuthCallback();
	const hasSynced = useRef(false); // this is used to not run useeffect > 1

	useEffect(() => {
		if (isSignedIn && user && !hasSynced.current) {
			hasSynced.current = true;

			syncUser(undefined, {
				onSuccess: (data) => {
					console.log("User synced with backend: ", data.name);
				},
				onError: (data) => {
					console.error("User sync failed for: ", data.name);
				},
			});
		}

		if (!isSignedIn) {
			hasSynced.current = false;
		}
	}, [isSignedIn, user, syncUser]);
	return null;
};

export default AuthSync;
