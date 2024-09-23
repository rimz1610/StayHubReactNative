import { useState, useEffect } from "react";
import {
  TouchableOpacity,
  BackHandler,
  Modal,
  View,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import RoomBooking from "../screen/Pages/Guest/Room/RoomBooking";
import GymBooking from "../screen/Pages/Guest/Gym/GymBooking";
import EventBooking from "../screen/Pages/Guest/Event/EventBooking";
import SpaBooking from "../screen/Pages/Guest/Spa/SpaBooking";
import Account from "../screen/Pages/Guest/Account/Account";
import EditMyProfile from "../screen/Pages/Guest/Account/EditMyProfile";
import ChangePassword from "../screen/Pages/Guest/Account/ChangePassword";
import MyBookings from "../screen/Pages/Guest/Account/MyBookings";
import MyRooms from "../screen/Pages/Guest/Account/MyRooms";
import RoomServiceBooking from "../screen/Pages/Guest/Account/RoomServiceBooking";
import BookingReceipt from "../screen/Pages/Guest/Booking/BookingReceipt";
import HotelMap from "../screen/Pages/Guest/HotelMap";
import BookingItems from "../screen/Pages/Guest/Booking/BookingItems";
import ConfirmBooking from "../screen/Pages/Guest/Booking/ConfirmBooking";
import MyBookingRReceipt from "../screen/Pages/Guest/Account/MyBookingReceipt";
import Ticket from "../screen/Pages/Guest/Account/Ticket";

const GuestBottomNav = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();
  const route = useRoute();

  const [backPressCount, setBackPressCount] = useState(0);
  const [exitModalVisible, setExitModalVisible] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, [backPressCount, navigation, route]);

  const handleBackPress = () => {
    const currentRouteName = route.name;
    const accountScreens = [
      "MyBookings",
      "BookingReceipt",
      "EditMyProfile",
      "ChangePassword",
      "MyRooms",
      "RoomServiceBooking",
      // "BookingItems",
      // "ConfirmBooking",
    ];

    if (accountScreens.includes(currentRouteName)) {
      navigation.navigate("Account");
      return true; // Prevent default back action
    }

    if (currentRouteName === "Account") {
      navigation.navigate("RoomBooking");
      return true;
    }

    if (backPressCount === 0) {
      setBackPressCount(1);
      setTimeout(() => setBackPressCount(0), 2000); // Reset count after 2 seconds
      return true; // Prevent default back action
    } else {
      setExitModalVisible(true); // Show confirmation modal
      return true; // Prevent default back action
    }
  };

  const confirmExitApp = () => {
    setExitModalVisible(false);
    BackHandler.exitApp(); // Exit the app
  };

  const cancelExitApp = () => {
    setExitModalVisible(false);
  };

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
    // headerShown: true,
    tabBarActiveTintColor: "white",
    tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
    tabBarStyle: Platform.select({
      ios: {
        backgroundColor: "#180161",
        height: 80,
        paddingBottom: 15,
        paddingTop: 15,
        borderTopWidth: 0,
        shadowOpacity: 0,
      },
      android: {
        backgroundColor: "#180161",
        height: 70,
        paddingBottom: 10,
        paddingTop: 5,
        elevation: 8,
      },
    }),
    tabBarLabelStyle: Platform.select({
      ios: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 5,
      },
      android: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 0,
      },
    }),
    headerStyle: Platform.select({
      ios: {
        backgroundColor: "#180161",
        height: 70,
        shadowOpacity: 0,
      },
      android: {
        backgroundColor: "#180161",
        height: 70,
        elevation: 4,
      },
    }),
    unmountOnBlur: true,
    headerTintColor: "white",
    headerTitleStyle: {
      fontWeight: "bold",
      textAlign: "center",
    },
    headerTitleAlign: "center",
    headerLeft: () => {
      const backScreens = [
        "MyBookings",
        "BookingReceipt",
        "EditMyProfile",
        "ChangePassword",
        "MyRooms",
        "RoomServiceBooking",
        // "BookingItems",
      ];
      const backScreenstwo = ["ConfirmBooking"];

      if (backScreens.includes(route.name)) {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("Account")}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        );
      } else if (backScreenstwo.includes(route.name)) {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("RoomBooking")}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("HotelMap")}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="location-outline" size={24} color="white" />
          </TouchableOpacity>
        );
      }
    },
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("Cart")}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="cart-outline" size={24} color="white" />
      </TouchableOpacity>
    ),
  });

  return (
    <>
      <Tab.Navigator
        screenOptions={screenOptions}
        initialRouteName="RoomBooking"
      >
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
          name="Cart"
          component={BookingItems}
          options={{
            headerShown: false,
            tabBarButton: () => null,
          }}
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
        <Tab.Screen
          name="Account"
          component={Account}
          options={{ title: "Account" }}
        />
        {/* Hidden screens */}
        <Tab.Screen
          name="MyBookings"
          component={MyBookings}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="BookingReceipt"
          component={BookingReceipt}
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
          name="ConfirmBooking"
          component={ConfirmBooking}
          options={{
            headerShown: false,
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
        <Tab.Screen
          name="Ticket"
          component={Ticket}
          options={{
            headerShown: false,
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>
      <Modal
        visible={exitModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelExitApp}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Are you sure you want to exit the app?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelExitApp}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={confirmExitApp}
              >
                <Ionicons
                  name="exit-outline"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.exitButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GuestBottomNav;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
  },
  exitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#180161",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  exitButtonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 5,
  },
});
