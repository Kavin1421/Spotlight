/* eslint-disable react-hooks/exhaustive-deps */
 import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

// This component is used to handle initial layout logic, such as redirects based on authentication state.
export default function InitialLayout() {
  // Check if the user is loaded and signed in
  const { isLoaded, isSignedIn } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const isAuthScreen = segments[0] === "(auth)";
    if (!isAuthScreen && !isSignedIn) {
      // If the user is not signed in and not on an auth screen, redirect to the sign-in page
      router.replace("/(auth)/login");
    }
    if (isAuthScreen && isSignedIn) {
      // If the user is signed in and on an auth screen, redirect to the tabs layout
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, segments]);
  // This component does not render anything itself, it only handles the logic for redirects
  if (!isLoaded) {
    return null; // Optionally, you can return a loading indicator here
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
