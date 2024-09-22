import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GuestBottomNav from "../components/GuestBottomNav";
import MyBookings from "../screen/Pages/Guest/Account/MyBookings";
import EditMyProfile from "../screen/Pages/Guest/Account/EditMyProfile";
import MyRooms from "../screen/Pages/Guest/Account/MyRooms";
import ChangePassword from "../screen/Pages/Guest/Account/ChangePassword";
import HotelMap from "../screen/Pages/Guest/HotelMap";
import BookingItems from "../screen/Pages/Guest/Booking/BookingItems";
import ConfirmBooking from "../screen/Pages/Guest/Booking/ConfirmBooking";
import BookingReceipt from "../screen/Pages/Guest/Booking/BookingReceipt";
import MyBookingReceipt from "../screen/Pages/Guest/Account/MyBookingReceipt";
import RoomServiceBooking from "../screen/Pages/Guest/Account/RoomServiceBooking";
const Drawer = createDrawerNavigator();
const GuestDrawerContent = (props) => {
  const { state, descriptors, navigation } = props;
  const activeRoute = state.routeNames[state.index];

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("expiry");
    await AsyncStorage.removeItem("generated");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("loginId");
    await AsyncStorage.removeItem("profile");
    await AsyncStorage.removeItem("guestNo");
    
    props.navigation.navigate("Login");
  };

  const renderDrawerItem = (label, targetRoute) => {
    const isActive = activeRoute === targetRoute;

    return (
      <TouchableOpacity
        style={[
          label == "My Bookings" ? styles.drawerFirstItem : styles.drawerItem,
          isActive && styles.activeDrawerItem,
        ]}
        onPress={() => navigation.navigate(targetRoute)}
      >
        <Text
          style={[
            styles.drawerItemText,
            isActive && styles.activeDrawerItemText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <Text style={styles.textheading}>Fatima Zuhra</Text>
        <Text style={styles.textheading}>guest@gmail.com</Text>
        {renderDrawerItem("My Bookings", "MyBookings")}
        {renderDrawerItem("Edit My Profile", "EditMyProfile")}
        {renderDrawerItem("My Rooms", "RMyRooms")}
        {renderDrawerItem("Change Pasword", "ChangePassword")}
        {renderDrawerItem("Hotel Map", "HotelMap")}

        <TouchableOpacity
          style={styles.drawerLastItem}
          onPress={async () => await handleLogout()}
        >
          <Text style={styles.drawerItemText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  textheading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerFirstItem: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  activeDrawerItem: {
    backgroundColor: "#123e66",
  },
  drawerLastItem: {
    padding: 15,
    marginTop: 140,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerItemText: {
    fontSize: 16,
  },
  activeDrawerItemText: {
    color: "#fffff",
    fontWeight: "bold",
  },
});

const GuestDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <GuestDrawerContent {...props} />}
      initialRouteName="GuestBottomNav"
    >
      <Drawer.Screen name="MyBookings" component={MyBookings} />
      <Drawer.Screen name="EditMyProfile" component={EditMyProfile} />
      <Drawer.Screen name="MyRooms" component={MyRooms} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      <Drawer.Screen name="HotelMap" component={HotelMap} />
      <Drawer.Screen
        name="Cart"
        component={BookingItems}
        options={{
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Checkout"
        component={ConfirmBooking}
        options={{
          headerShown: true,
        }}
      />
      <Drawer.Screen name="BookingConfirmation" component={BookingReceipt} />
      <Drawer.Screen name="MyBookingReceipt" component={MyBookingReceipt} />
      <Drawer.Screen name="RoomServiceBooking" component={RoomServiceBooking} />
      <Drawer.Screen name="GuestBottomNav" component={GuestBottomNav} />
      {/* <Drawer.Screen name="ConfirmBooking" component={ConfirmBooking} /> */}
      {/* <Drawer.Screen name="GuestBottomNav" component={BookingItems} /> */}
    </Drawer.Navigator>
  );
};

export default GuestDrawer;
