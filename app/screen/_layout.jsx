import * as React from "react";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "./Pages/Guest/Signup";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Admin/Booking/Dashboard";
import BookingDetails from "./Pages/Admin/Booking/BookingDetails";
import RoomList from "./Pages/Admin/Room/RoomList";
import AddEditRoom from "./Pages/Admin/Room/AddEditRoom";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import RoomPriceAvailabilityDetails from "./Pages/Admin/RoomPrice/RoomPriceDetails";
import AddEditEvent from "./Pages/Admin/Event/AddEditEvent";
import EventList from "./Pages/Admin/Event/EventList";
import GymList from "./Pages/Admin/Gym/GymList";
import AddEditGym from "./Pages/Admin/Gym/AddEditGym";
import GuestList from "./Pages/Admin/Guest/GuestList";
import GuestDetails from "./Pages/Admin/Guest/GuestDetail";
import RoomsPriceSetting from "./Pages/Admin/RoomPrice/RoomsPriceSetting";
import SpaList from "./Pages/Admin/Spa/SpaList";
import AddEditSpa from "./Pages/Admin/Spa/AddEditSpa";
import StaffList from "./Pages/Admin/Staff/StaffList";
import StaffActivityList from "./Pages/Admin/Staff/StaffActivities";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ChangePassword from "./Pages/Guest/Account/ChangePassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import GuestBottomNav from "../components/GuestBottomNav";
import GuestDrawer from "../components/GuestDrawerContent";
import MyBookings from "./Pages/Guest/Account/MyBookings";
import BookingReceipt from "./Pages/Guest/Booking/BookingReceipt";
import BookingItems from "./Pages/Guest/Booking/BookingItems";
import ConfirmBooking from "./Pages/Guest/Booking/ConfirmBooking";
import Receipt from "./Pages/Guest/Booking/Receipt";
import Ticket from "./Pages/Guest/Account/Ticket";
import AdminChangePassword from "./Pages/Admin/ChangePassword";
// import { SafeAreaView } from "react-native-safe-area-context";

function App() {
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#000"
        translucent={false}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="RoomList" component={RoomList} />
          <Stack.Screen name="AddEditRoom" component={AddEditRoom} />
          <Stack.Screen
            name="RoomsPriceDetails"
            component={RoomPriceAvailabilityDetails}
          />
          <Stack.Screen
            name="RoomsPriceSetting"
            component={RoomsPriceSetting}
          />
          <Stack.Screen name="EventList" component={EventList} />
          <Stack.Screen name="AddEditEvent" component={AddEditEvent} />
          <Stack.Screen name="GymList" component={GymList} />
          <Stack.Screen name="AddEditGym" component={AddEditGym} />
          <Stack.Screen name="SpaList" component={SpaList} />
          <Stack.Screen name="AddEditSpa" component={AddEditSpa} />
          <Stack.Screen name="GuestList" component={GuestList} />
          <Stack.Screen name="GuestDetails" component={GuestDetails} />
          <Stack.Screen name="StaffList" component={StaffList} />
          <Stack.Screen name="AdminChangePassword" component={AdminChangePassword}/>
          <Stack.Screen
            name="StaffActivityList"
            component={StaffActivityList}
          />
          <Stack.Screen name="GuestBottomNav" component={GuestBottomNav} />
          <Stack.Screen name="MyBookings" component={MyBookings} />
          <Stack.Screen name="BookingReceipt" component={BookingReceipt} />
          <Stack.Screen name="BookingItems" component={BookingItems} />
          <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
          <Stack.Screen name="Receipt" component={Receipt} />
          <Stack.Screen name="Ticket" component={Ticket} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
registerRootComponent(App);
export default App;
