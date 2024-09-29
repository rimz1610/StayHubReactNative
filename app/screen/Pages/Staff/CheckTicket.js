import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollViewComponent,
  ScrollView, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StaffDrawer from "../../../components/StaffDrawer";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
const Drawer = createDrawerNavigator();
const CheckTicketContent = ({ navigation }) => {
  const TicketDetail = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [hasSearched, setHasSearched] = useState(false);
  const hotelData = {
    phone: "+1 884-6789-9876",
    email: "info@stayhub.com",
    name: "StayHub Hotel & Resort",
    address: "346 Matangi Road",
    city: "Albama, 23456, United States",
  };
  useEffect(() => {
    if (isFocused) {
      setTicketNumber("");
      setTicketData(null);
      setHasSearched(false);
    }
  }, [isFocused]);
  const fetchTicketDetails = async () => {
    if (ticketNumber == "") {
      Alert.alert("Error", "Please enter ticket number.");
    }
    else {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://majidalipl-001-site5.gtempurl.com/Ticket/GetTicketByTicketNo?ticketNo=" +
          ticketNumber,
        );
        setHasSearched(true);
        if (response.data.success) {
          setTicketData(response.data.data);
        } else {
          setTicketData(null);

        }
      } catch (error) {

        Alert.alert("Error", "Failed to fetch ticket details.");

      } finally {
        setLoading(false);
      }
    }
  };

  const UpdateTicketStatus = async () => {

    setLoading(true);
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Ticket/UpdateTicketStatus?id=" + ticketData.id +
        "&status=Scanned"
      );

      if (response.data.success) {
        setTicketData({ ...ticketData, status: "Scanned" });
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "Failed to update ticket status.");

    } finally {
      setLoading(false);
    }
  };

  return (<>
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.roomheading}>Ticket Check</Text>
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>


            <TextInput
              placeholder="Enter Ticket Number"
              style={styles.input}
              value={ticketNumber}
              onChangeText={setTicketNumber}
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              disabled={loading}
              onPress={fetchTicketDetails}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>SEARCH</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {hasSearched && ticketData === null && (
          <Text style={styles.noTicketText}>No ticket found</Text>
        )}
        {ticketData != null &&
          <>
            <Text style={styles.title}>Ticket Booking Details</Text>
            <View key={3} style={styles.ticketContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.detailsContainer}>
                <TicketDetail
                  label="Invoice Date"
                  value={ticketData.bookingDate}
                />
                <TicketDetail
                  label="Booking Person"
                  value={ticketData.firstName + " " + ticketData.lastName}
                />
                <TicketDetail
                  label="Booking Ref #"
                  value={ticketData.refNo}
                />
                <TicketDetail
                  label="Event"
                  value={ticketData.eventName}
                />
                <TicketDetail label="Date" value={ticketData.eventDate} />
                <TicketDetail label="Time" value={ticketData.eventTime} />
                <TicketDetail label="Ticket" value={ticketData.ticket} />
                <TicketDetail
                  label="Serial #"
                  value={ticketData.ticketNumber}
                />
                <TicketDetail
                  label="Location"
                  value={ticketData.location}
                />
                <TicketDetail
                  label="Status"
                  value={ticketData.status}
                />
                {
                  ticketData.status == "Not Used" &&
                  <TouchableOpacity style={styles.useButton} onPress={UpdateTicketStatus}>
                    <Text style={styles.useButtonText}>Use It</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>{hotelData.phone}</Text>
              <Text style={styles.footerText}>{hotelData.email}</Text>
              <Text style={styles.footerText}>{hotelData.name}</Text>
              <Text style={styles.footerText}>{hotelData.address}</Text>
              <Text style={styles.footerText}>{hotelData.city}</Text>
            </View>
          </>}
      </View>
    </ScrollView>
  </>
  );
};
const CheckTaskDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <StaffDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "60%",
        },
      }}
    >
      <Drawer.Screen name="CheckTicketContent" component={CheckTicketContent} />
    </Drawer.Navigator>
  );
};
export default CheckTaskDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  menuButton: {
    position: "absolute",
    top: 34,
    left: 20,
    zIndex: 1,
  },
  roomheading: {
    marginTop: 32,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  singleRow: {
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#180161",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },

  saveButton: {
    backgroundColor: "#180161",
    padding: 15,
    width: "70%",
    borderRadius: 4,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 18,
  },
  useButton: {
    backgroundColor: "white",
    padding: 15,
    width: "70%",
    borderRadius: 4,
    alignSelf: "center",
  },
  useButtonText: {
    color: "180161",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  ticketContainer: {
    backgroundColor: "#27496d",
    marginTop: 2,
    margin: 16,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  alignItems: "center",
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#fff",
    flex: 2,
    textAlign: "right",
  },
  footer: {
    // backgroundColor: "#dfe4ea",
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#34495e",
  },
});
