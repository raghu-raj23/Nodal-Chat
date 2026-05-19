import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/react-native";

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
					Sentry.logger.info(
						Sentry.logger.fmt`User synced with backend: ${data.name}`,
						{ userId: data?._id, userName: data.name },
					);
				},
				onError: (error) => {
					Sentry.logger.error(
						Sentry.logger.fmt`User sync failed for: ${error}`,
					);
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
