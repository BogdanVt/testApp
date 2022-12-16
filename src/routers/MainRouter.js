/* eslint-disable */
import React from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";

export const Stack = createNativeStackNavigator();
export const MainRouter = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


