// GuestBottomNav.js
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import RoomBooking from "../screen/Pages/Guest/Room/RoomBooking";
import GymBooking from "../screen/Pages/Guest/Gym/GymBooking";
import EventBooking from "../screen/Pages/Guest/Event/EventBooking";
import SpaBooking from "../screen/Pages/Guest/Spa/SpaBooking";
import EditMyProfile from "../screen/Pages/Guest/Account/EditMyProfile";

const GuestBottomNav = () => {
  const Tab = createBottomTabNavigator();

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === "RoomBooking") {
        iconName = focused ? "bed" : "bed-outline";
      } else if (route.name === "GymBooking") {
        iconName = focused ? "fitness" : "fitness-outline";
      } else if (route.name === "EventBooking") {
        iconName = focused ? "calendar" : "calendar-outline";
      } else if (route.name === "SpaBooking") {
        iconName = focused ? "water" : "water-outline";
      } else if (route.name === "Account") {
        iconName = focused ? "person" : "person-outline";
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: "white",
    tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
    tabBarStyle: {
      backgroundColor: "#180161",
      height: 70,
      paddingBottom: 10,
      paddingTop: 5,
    },
    headerStyle: {
      backgroundColor: "#180161",
      height: 70,
    },
    headerTintColor: "white",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          // Handle cart button press
        }}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="cart-outline" size={24} color="white" />
      </TouchableOpacity>
    ),
  });

  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="RoomBooking">
      <Tab.Screen
        name="RoomBooking"
        component={RoomBooking}
        options={{ title: "Rooms" }}
      />
      <Tab.Screen
        name="GymBooking"
        component={GymBooking}
        options={{ title: "Gym" }}
      />
      <Tab.Screen
        name="EventBooking"
        component={EventBooking}
        options={{ title: "Event" }}
      />
      <Tab.Screen
        name="SpaBooking"
        component={SpaBooking}
        options={{ title: "Spa" }}
      />
      <Tab.Screen name="Account" component={EditMyProfile} />
    </Tab.Navigator>
  );
};

export default GuestBottomNav;
