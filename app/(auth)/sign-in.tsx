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
import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const onSignIn = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error.message, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/(root)/(tabs)");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      } else {
        console.error("No supported second factor found");
      }
    }

    // if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/(root)/(tabs)");
          router.replace(url as any);
        },
      });
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <View className="justify-center flex-1 px-6 py-12">
        <TouchableOpacity className="justify-center items-center py-4 bg-black/10 rounded-full w-12 h-12 mb-3">
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
          onPress={onVerify}
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
          onPress={() => signIn.mfa.sendEmailCode()}
          className="items-center py-4 mt-2 "
        >
          <Text className="text-gray-500">I need a new code</Text>
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

        <Text className="text-3xl font-bold">Welcome Back</Text>
        <Text className="text-gray-500 ">
          Sign in to your account using email and password.
        </Text>

        <TextInput
          className="w-full px-5 py-4 mt-3 border border-gray-300 rounded-xl"
          placeholder="E-mail"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="text-red-500">
            {errors.fields.identifier.message}
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
          onPress={onSignIn}
          disabled={isLoading}
          className="items-center py-4 mt-6 bg-black rounded-md "
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <ActivityIndicator animating={true} color="white" />
              <Text className="text-white">Signing in...</Text>
            </View>
          ) : (
            <Text className="text-lg font-bold text-white">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="mt-6 text-gray-500 ">
            Don&apos;t have an account?
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text className="mt-6 ml-2 font-bold text-black">Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}
