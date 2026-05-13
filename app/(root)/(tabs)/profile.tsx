import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/sign-in"); // Redirect to the login screen after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Text>ProfileScreen</Text>

        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isLoading}
          className="items-center py-4 mt-6 bg-black rounded-md "
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <ActivityIndicator animating={true} color="white" />
              <Text className="text-white">Logging out...</Text>
            </View>
          ) : (
            <Text className="text-lg font-bold text-white">Log Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
