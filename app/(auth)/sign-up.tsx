import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuth, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  if(signUp.status === "complete" && isSignedIn) {
    return null;
  }

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const onSignUp = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      console.error(JSON.stringify(error.message, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyEmail = async () => {
    await signUp.verifications.verifyEmailCode({code});

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate:({decorateUrl}) => {
          const url = decorateUrl("/(root)/(tabs)");
          router.replace(url as any);
        }
      })
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="justify-center flex-1 px-6 py-12">
        <TouchableOpacity
          className="justify-center items-center py-4 bg-black/10 rounded-full w-12 h-12 mb-3"
        >
          <Ionicons name="arrow-back" size={18} color="black" />
        </TouchableOpacity>
        <Image
          source={require("@/assets/images/Rental.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold">Verify your email</Text>
        <Text className="text-gray-500 ">
          We have a verification code to {email}
        </Text>

        <View className="flex-row gap-3 mt-6">
          <TextInput
            className="flex-1 px-5 py-4 border border-gray-300 rounded-xl"
            placeholder="Enter verification code"
            placeholderTextColor="#9ca3af"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
        </View>

        {errors.fields.code && (
          <Text className="text-red-500">{errors.fields.code.message}</Text>
        )}

        <TouchableOpacity
          onPress={onVerifyEmail}
          disabled={isLoading}
          className="items-center py-4 mt-6 bg-black rounded-md "
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <ActivityIndicator animating={true} color="white" />
              <Text className="text-white">Verifying...</Text>
            </View>
          ) : (
            <Text className="text-lg font-bold text-white">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
          className="items-center py-4 mt-2 "
        >
          <Text className="text-gray-500">
            I need a new code
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="justify-center flex-1 px-6 py-12">
        <Image
          source={require("@/assets/images/Rental.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold">Create Account</Text>
        <Text className="text-gray-500 ">
          Find your perfect rental property today
        </Text>

        <View className="flex-row gap-3 mt-6">
          <TextInput
            className="flex-1 px-5 py-4 border border-gray-300 rounded-xl"
            placeholder="First Name"
            placeholderTextColor="#9ca3af"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <TextInput
            className="flex-1 px-5 py-4 border border-gray-300 rounded-xl"
            placeholder="Last Name"
            placeholderTextColor="#9ca3af"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <TextInput
          className="w-full px-5 py-4 mt-3 border border-gray-300 rounded-xl"
          placeholder="E-mail"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-500">
            {errors.fields.emailAddress.message}
          </Text>
        )}

        <TextInput
          className="w-full px-5 py-4 mt-3 border border-gray-300 rounded-xl"
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-red-500">{errors.fields.password.message}</Text>
        )}

        <TouchableOpacity
          onPress={onSignUp}
          disabled={isLoading}
          className="items-center py-4 mt-6 bg-black rounded-md "
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <ActivityIndicator animating={true} color="white" />
              <Text className="text-white">Signing up...</Text>
            </View>
          ) : (
            <Text className="text-lg font-bold text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="mt-6 text-gray-500 ">Already have an account?</Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text className="mt-6 ml-2 font-bold text-black">Sign In</Text>
          </TouchableOpacity>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
