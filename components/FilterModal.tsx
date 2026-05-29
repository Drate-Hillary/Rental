import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under UgX 5M", min: null, max: 5000000 },
  { label: "UgX 5M  UgX 10M", min: 5000000, max: 10000000 },
  { label: "UgX 10M  UgX 20M", min: 10000000, max: 20000000 },
  { label: "Above UgX 20M", min: 20000000, max: null },
];

const BATHS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-700"}`;
const chip = (active: boolean) =>
  `px-4 py-2 rounded-full ${active ? "bg-blue-600" : "bg-gray-200"}`;

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    setPropertyType,
    setMinPrice,
    setMaxPrice,
    setBedrooms,
    setBathrooms,
    resetFilters,
  } = useFilterStore();

  const [localMinPrice, setLocalMinPrice] = useState(
    minPrice ? minPrice.toString() : "",
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    maxPrice ? maxPrice.toString() : "",
  );

  const activeCount = [
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
  ].filter((v) => v !== null).length;

  const handleApply = () => {
    setMinPrice(localMinPrice ? Number(localMinPrice) : null);
    setMaxPrice(localMaxPrice ? Number(localMaxPrice) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMinPrice(minPrice ? minPrice.toString() : "");
    setLocalMaxPrice(maxPrice ? maxPrice.toString() : "");
    resetFilters();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1 p-4">
        <TouchableOpacity>
          <Ionicons
            name="close"
            size={24}
            color="black"
            onPress={onClose}
            className="my-1 ml-auto me-2"
          />
        </TouchableOpacity>
        <View className="flex-row items-center pt-4 pb-5 ps-5">
          <Text className="text-xl font-bold">Filters</Text>
        </View>
        {/* Filter options will go here */}

        <ScrollView className="flex-1">
          <View className="mb-6">
            <Text className="mt-4 text-lg font-semibold">Property Type</Text>

            <View className="flex-row flex-wrap gap-3">
              {TYPES.map((type) => {
                const active = propertyType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    className={`${chip(active)}`}
                    onPress={() => setPropertyType(type.value)}
                  >
                    <Text className={chipText(active)}>{type.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="mt-6 text-lg font-semibold">Bedrooms</Text>
            <View className="flex-row flex-wrap items-center gap-3">
              {BEDS.map((bed) => {
                const active = bedrooms === bed.value;
                return (
                  <TouchableOpacity
                    key={bed.value}
                    className={`${chip(active)} flex-1 items-center justify-center`}
                    onPress={() => setBedrooms(bed.value)}
                  >
                    <Text className={chipText(active)}>{bed.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="mt-6 text-lg font-semibold">Bathrooms</Text>
            <View className="flex-row flex-wrap items-center gap-3">
              {BATHS.map((bath) => {
                const active = bathrooms === bath.value;
                return (
                  <TouchableOpacity
                    key={bath.value}
                    className={`${chip(active)} flex-1 items-center justify-center`}
                    onPress={() => setBathrooms(bath.value)}
                  >
                    <Text className={chipText(active)}>{bath.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="mt-6 text-lg font-semibold">Price Range</Text>
            <View className="flex-row items-center gap-3 mt-1">
              {[
                {
                  label: "Min price",
                  value: localMinPrice,
                  onChange: setLocalMinPrice,
                  placeholder: "0",
                },
                {
                  label: "Max price",
                  value: localMaxPrice,
                  onChange: setLocalMaxPrice,
                  placeholder: "Any",
                },
              ].map(({ label, value, onChange, placeholder }) => (
                <View key={label} className="flex-1">
                  <Text className="text-base font-medium">{label}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-lg font-bold">Ugx</Text>
                    <TextInput
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={value}
                      onChangeText={onChange}
                      placeholder={placeholder}
                      keyboardType="numeric"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>
              ))}
            </View>

            <View className="flex-row flex-wrap gap-2 mt-4">
              {PRICE_PRESETS.map((preset) => {
                const active =
                  (preset.min === null ||
                    preset.min.toString() === localMinPrice) &&
                  (preset.max === null ||
                    preset.max.toString() === localMaxPrice);
                return (
                  <TouchableOpacity
                    key={preset.label}
                    className={`px-3 py-1 rounded-full ${active ? "bg-blue-600" : "bg-gray-200"}`}
                    onPress={() => {
                      setLocalMinPrice(preset.min ? preset.min.toString() : "");
                      setLocalMaxPrice(preset.max ? preset.max.toString() : "");
                    }}
                  >
                    <Text className={chipText(active)}>{preset.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="px-5 pt-20">
              <TouchableOpacity
                onPress={handleApply}
                className="items-center w-full py-4 bg-blue-600 rounded-md"
              >
                <Text className="font-medium text-white">
                  Apply Filters {activeCount > 0 ? `${activeCount}` : ""}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="px-5 mt-3">
              <TouchableOpacity
                onPress={handleReset}
                className="items-center w-full py-4 bg-gray-300 rounded-md"
              >
                <Text className="font-medium text-gray-700">Reset Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
