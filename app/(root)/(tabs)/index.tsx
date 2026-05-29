import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from "@/components/featuredCard";
import PropertyCard from "@/components/PropertyCard";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  const fetchProperties = async () => {
    setLoading(true);

    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center pt-4 pb-5 ps-5">
              <Image
                source={require("@/assets/images/Rental.png")}
                resizeMode="contain"
                style={{ width: 40, height: 40 }}
              />

              <Text className="text-lg font-bold">Find Your Next Home</Text>
            </View>

            {/* User */}
            <View className="flex-row items-center px-5 mb-4">
              <Image
                source={{ uri: user?.imageUrl }}
                className="rounded-full h-14 w-14"
              />
              <View className="ms-0">
                <Text className="text-lg font-bold ms-4">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-sm text-gray-500 ms-4">
                  {user?.emailAddresses[0]?.emailAddress}
                </Text>
              </View>
            </View>

            {/* Search bar */}
            <TouchableOpacity>
              <View className="flex-row items-center px-4 py-2 mx-5 mb-4 bg-white border border-gray-300 rounded-lg">
                <View className="flex-row items-center flex-1">
                  <Ionicons name="search" size={20} className="text-gray-500" />
                  <Text className="text-gray-500 ms-3">
                    Search for properties...
                  </Text>
                </View>

                <TouchableOpacity className="bg-gray-200 h-8 w-8 rounded-lg items-center justify-center">
                  <Ionicons name="options-outline" color="black" size={16} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Featured Section */}
            <View className="px-4 mt-8 mb-6">
              <Text className="text-lg font-bold">Featured Properties</Text>
              {loading ? (
                <View className="flex flex-row items-center justify-center gap-3 mt-4">
                  <ActivityIndicator size="small" color="black" />
                  <Text className="text-gray-500">
                    Loading featured properties...
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 2 }}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                />
              )}
            </View>

            {/* Recommended Section */}
            <View className="px-4 mb-4">
              <Text className="text-lg font-bold">Recommended for You </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className="px-5">
              <Text>No recommended properties found.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
