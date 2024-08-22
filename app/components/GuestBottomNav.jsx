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
      <Tab.Screen name="GymBooking" component={GymBooking} />
      <Tab.Screen name="EventBooking" component={EventBooking} />
      <Tab.Screen name="SpaBooking" component={SpaBooking} />
      <Tab.Screen name="Account" component={EditMyProfile} />
    </Tab.Navigator>
  );
};

export default GuestBottomNav;
