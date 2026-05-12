import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

export default function Onboarding() {
  const [isLoading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/");
      setLoading(false);
    }, 2000);
  };

  return (
    <View className="flex-1">
      <View className="relative w-full h-100">
        <Image
          source={require("@/assets/images/rental-onboarding.webp")}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute bottom-20 left-6 right-6">
          <Image
            source={require("@/assets/images/Rental.png")}
            className="w-40 h-40 left-0 text-white"
          />
          <Text className="text-white text-4xl font-bold">
            Find Your Perfect Rental
          </Text>

          <Text className="text-white/90 text-base mt-1">
            Discover houses, apartments, and rooms easily.
          </Text>

          <TouchableOpacity
            className="bg-white rounded-full py-4 px-8 mt-9 w-50"
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator animating={true} color="#000" />
            ) : (
              <Text className="text-center font-semibold">Get Started</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
