// GuestDrawer.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer"; // Ensure this import is correct
import GuestDrawerContent from "../components/GuestDrawerContent";
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

const Drawer = createDrawerNavigator(); // Ensure this line is correct

const GuestDrawer = () => {
  return <></>;
};

export default GuestDrawer;
