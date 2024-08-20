import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import RoomBooking from './Pages/Guest/Room/RoomBooking';
import GymBooking from './Pages/Guest/Gym/GymBooking';
import EventBooking from './Pages/Guest/Event/EventBooking';
import SpaBooking from './Pages/Guest/Spa/SpaBooking';
import EditMyProfile from './Pages/Guest/Account/EditMyProfile';

export default function TabNavigator() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="RoomBooking">
        <Tab.Screen name="RoomBooking" component={RoomBooking} />
        <Tab.Screen name="Gym" component={GymBooking} />
        <Tab.Screen name="Event" component={EventBooking} />
        <Tab.Screen name="Spa" component={SpaBooking} />
        <Tab.Screen name="Profile" component={EditMyProfile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}