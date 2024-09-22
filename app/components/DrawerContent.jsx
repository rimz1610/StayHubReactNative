import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DrawerContent = (props) => {
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
          label == "Manage Bookings"
            ? styles.drawerFirstItem
            : styles.drawerItem,
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
        <Text style={styles.textheading}>David Robinson</Text>
        <Text style={styles.textheading}>admin@gmail.com</Text>
        {renderDrawerItem("Manage Bookings", "Dashboard")}
        {renderDrawerItem("Manage Rooms", "RoomList")}
        {renderDrawerItem("Manage Rooms Price", "RoomsPriceDetails")}
        {renderDrawerItem("Manage Events", "EventList")}
        {renderDrawerItem("Manage Staffs", "StaffList")}
        {renderDrawerItem("Manage Guests", "GuestList")}
        {renderDrawerItem("Manage Gyms", "GymList")}
        {renderDrawerItem("Manage Spas", "SpaList")}
        {renderDrawerItem("Change Password", "AdminChangePassword")}
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

export default DrawerContent;
