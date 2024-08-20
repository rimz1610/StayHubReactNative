// GuestBottomNav.js
import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RoomBooking from "../screen/Pages/Guest/Room/RoomBooking";
import GymBooking from "../screen/Pages/Guest/Gym/GymBooking";
import EventBooking from "../screen/Pages/Guest/Event/EventBooking";
import SpaBooking from "../screen/Pages/Guest/Spa/SpaBooking";
import EditMyProfile from "../screen/Pages/Guest/Account/EditMyProfile";

const GuestBottomNav = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName="RoomBooking">
      <Tab.Screen name="RoomBooking" component={RoomBooking} />
      <Tab.Screen name="Gym" component={GymBooking} />
      <Tab.Screen name="Event" component={EventBooking} />
      <Tab.Screen name="Spa" component={SpaBooking} />
      <Tab.Screen name="Profile" component={EditMyProfile} />
    </Tab.Navigator>
  );
};

export default GuestBottomNav;
