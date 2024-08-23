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
import BookingItems from "../screen/Pages/Guest/Booking/BookingItems";
import BookingReceipt from "../screen/Pages/Guest/Booking/BookingReceipt";
import ConfirmBooking from "../screen/Pages/Guest/Booking/ConfirmBooking";
import HotelMap from "../screen/Pages/Guest/HotelMap";
import ChangePassword from "../screen/Pages/Guest/Account/ChangePassword";
import MyBookingRReceipt from "../screen/Pages/Guest/Account/MyBookingReceipt";
import MyBookings from "../screen/Pages/Guest/Account/MyBookings";
import MyRooms from "../screen/Pages/Guest/Account/MyRooms";
import RoomServiceBooking from "../screen/Pages/Guest/Account/RoomServiceBooking";
import { createDrawerNavigator } from "@react-navigation/drawer";

const GuestBottomNav = ({ navigation }) => {
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
    // tabBarButton: () => {
    //   if (route.name === "Account") {
    //     return <TouchableOpacity onPress={() => navigation.openDrawer()} />;
    //   }
    // },
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
          navigation.navigate("Cart");
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

      <Tab.Screen name="Account" component={() => null} />
      <Tab.Screen
        name="Cart"
        component={BookingItems}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Checkout"
        component={ConfirmBooking}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="BookingConfirmation"
        component={BookingReceipt}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookings}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="MyBookingReceipt"
        component={MyBookingRReceipt}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="EditMyProfile"
        component={EditMyProfile}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="MyRooms"
        component={MyRooms}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RoomServiceBooking"
        component={RoomServiceBooking}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="HotelMap"
        component={HotelMap}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default GuestBottomNav;
