import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "./Pages/Admin/Booking/Dashboard";
// import GuestDrawer from "../components/GuestDrawerContent";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Main"
      >
        <Stack.Screen name="Main" component={Dashboard} />
      </Stack.Navigator>
      <GuestDrawer />
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
