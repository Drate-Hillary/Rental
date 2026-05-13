import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Property } from "@/types";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "@/lib/utils";

export default function PropertyCard({
  property,
  onUnSave,
  showSave = false,
}: {
  property: Property;
  onUnSave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row mb-4 ms-2 overflow-hidden bg-white rounded-xl border border-gray-200 me-2"
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
        className="h-28 w-28"
        resizeMode="cover"
      />

      <View className="flex-1 px-3 py-2">
        <Text className="text-sm font-semibold capitalize">
          {property.title}
        </Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Ionicons name="location-sharp" size={14} className="text-gray-600" />
          <Text className="text-sm text-gray-600">
            {property.address}, {property.city}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-1 mt-2">
          <View className="flex-row items-center gap-1">
            <Ionicons name="pricetag" size={14} className="text-gray-600" />
            <Text className="text-sm font-bold">
              {formatPrice(property.price)}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Ionicons name="resize" size={14} className="text-gray-600" />
            <Text className="text-sm text-gray-600">
              {property.area_sqft} sqft
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="bed-outline" />
            <Text className="text-sm text-gray-600">
              {property.bedrooms} beds
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Ionicons name="water-outline" />
            <Text className="text-sm text-gray-600">
              {property.bathrooms} baths
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className="absolute top-2 right-2 p-1">
        {!property.is_sold && (
          <View className="px-2 py-0.5 bg-red-500 rounded-full ms-2">
            <Text className="text-xs font-semibold text-white">Sold</Text>
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
