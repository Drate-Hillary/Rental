import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Property } from "@/types";
import { useRouter } from "expo-router";
import { formatPrice } from "@/lib/utils";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="mr-3 overflow-hidden bg-gray-200 rounded-3xl w-72"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        opacity: property.is_sold ? 0.5 : 1,
      }}
      onPress={() => router.push(`/root/property/${property.id}`)}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-44"
        resizeMode="cover"
      />
      <View className="absolute px-3 py-1 rounded-full bg-white/90 top-3 left-3">
        <Text className="text-sm font-semibold capitalize">
          {property.title}
        </Text>
      </View>

      {/* sold badge */}
      {property.is_sold && (
        <View className="absolute px-3 py-1 bg-red-500 rounded-full top-3 right-3">
          <Text className="text-sm font-semibold text-white">Sold</Text>
        </View>
      )}

      <View className="p-3">
        <Text className="text-lg font-bold">{formatPrice(property.price)}</Text>
        <Text className="mt-1 text-gray-600">{property.address}, {property.city}</Text>
      </View>
    </TouchableOpacity>
  );
}
