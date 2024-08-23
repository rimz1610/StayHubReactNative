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
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import ChangePassword from "./Pages/Guest/Account/ChangePassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import GuestBottomNav from "../components/GuestBottomNav";
import GuestDrawer from "../components/GuestDrawerContent";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
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
          <Stack.Screen
            name="StaffActivityList"
            component={StaffActivityList}
          />
          <Stack.Screen name="GuestBottomNav" component={GuestBottomNav} />
          {/* <Stack.Screen name="GuestDrawer" component={GuestDrawer} /> */}
        </Stack.Navigator>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
registerRootComponent(Dashboard);
export default App;
