import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import FilterModal from "@/components/FilterModal";
import { formatPrice } from "@/lib/utils";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";

export default function SearchScreen() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  const {
    search,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    setSearch,
    setPropertyType,
    setMinPrice,
    setMaxPrice,
    setBedrooms,
    setBathrooms,
  } = useFilterStore();

  const activeFilterCount = [
    propertyType !== null,
    minPrice !== null,
    maxPrice !== null,
    bedrooms !== null,
    bathrooms !== null,
  ].filter(Boolean).length;

  useEffect(()=> {
    fetchResults();
  }, [search, propertyType, minPrice, maxPrice, bedrooms, bathrooms])

  const fetchResults = async () => {
    setLoading(true)

    let query = supabase.from("properties").select("*");

    if(search){
      query = query.or(`title.ilike.%${search}%, city.ilike.%${search}%`);
    }

    if(propertyType){
      query = query.eq("type", propertyType);
    }

    if(minPrice){
      query = query.gte("price", minPrice);
    }

    if(maxPrice){
      query = query.lte("price", maxPrice);
    }

    if(bedrooms){
      query = query.eq("bedrooms", bedrooms);
    }

    if(bathrooms){
      query = query.eq("bathrooms", bathrooms);
    }

    const {data} = await query.order("created_at", { ascending: false });
    setResults(data || []);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="px-4 pt-4 pb-3">
        {/* Header */}
        <View className="flex-row items-center pt-4 pb-5 ps-5">
          <Text className="text-xl font-bold">Find Your Next Home</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <View
            className="flex-row items-center flex-1 gap-3 px-4 py-1 bg-white rounded rounded-rounded-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="search-outline" size={18} />
            <TextInput
              placeholder="Search by city, neighborhood, or address"
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              className="flex-1 py-3"
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} className="p-1">
                <Ionicons name="close" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`w-14 h-14 items-center justify-center rounded-xl py-1 ${activeFilterCount > 0 ? "bg-blue-600" : "bg-gray-100"}`}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={activeFilterCount > 0 ? "white" : "black"}
            />

            {activeFilterCount > 0 && (
              <View className="absolute items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-1 -right-1">
                <Text className="text-xs font-bold text-white">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* filter chips */}
        {activeFilterCount > 0 && (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerClassName="flex-row items-center gap-2"
          >
            {propertyType !== null && (
              <View className="flex-row items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-3 py-1">
                <Text className="text-purple-800 text-sm capitalize">
                  {propertyType}
                </Text>
                <TouchableOpacity onPress={() => setPropertyType(null)} className="p-1">
                  <Ionicons name="close" size={14} color="red" />
                </TouchableOpacity>
              </View>
            )}
            {minPrice !== null && (
              <View className="flex-row items-center gap-2 bg-green-100 border border-green-300 rounded-full px-3 py-1">
                <Ionicons name="cash" size={14} color="green" />
                <Text className="text-green-800 text-sm">
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`}
                </Text>

                <TouchableOpacity onPress={() => { setMinPrice(null); setMaxPrice(null); }} className="p-1">
                  <Ionicons name="close" size={14} color="red" />
                </TouchableOpacity>
              </View>
            )}
            {bedrooms !== null && (
              <View className="flex-row items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-3 py-1">
                <Ionicons name="bed" size={14} color="purple" />
                <Text className="text-purple-800 text-sm">
                  {bedrooms === 2
                    ? "2+ Beds"
                    : `${bedrooms} Bed${bedrooms > 1 ? "s" : ""}`}
                </Text>

                <TouchableOpacity onPress={() => setBedrooms(null)} className="p-1">
                  <Ionicons name="close" size={14} color="red" />
                </TouchableOpacity>
              </View>
            )}
            {bathrooms !== null && (
              <View className="flex-row items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-3 py-1">
                <Ionicons name="water" size={14} color="blue" />
                <Text className="text-blue-800 text-sm">
                  {bathrooms === 2
                    ? "2+ Bathrooms"
                    : `${bathrooms} Bath${bathrooms > 1 ? "s" : ""}`}
                </Text>

                <TouchableOpacity onPress={() => setBathrooms(null)} className="p-1">
                  <Ionicons name="close" size={14} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text>
            {loading ? "Searching..." : `${results.length} properties found`}
          </Text>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className="flex justify-center items-center px-5">
              <Text className="text-gray-500 text-3xl font-extralight">No properties found.</Text>
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}
