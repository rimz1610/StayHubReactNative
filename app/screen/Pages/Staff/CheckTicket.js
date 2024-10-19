import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StaffDrawer from "../../../components/StaffDrawer";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const TicketDetail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const CheckTicketContent = ({ navigation }) => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const isFocused = useIsFocused();

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
    if (ticketNumber === "") {
      Alert.alert("Error", "Please enter a ticket number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://tehreemimran-001-site1.htempurl.com/Ticket/GetTicketByTicketNo?ticketNo=${ticketNumber}`
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
  };

  const updateTicketStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://tehreemimran-001-site1.htempurl.com/Ticket/UpdateTicketStatus?id=${ticketData.id}&status=Scanned`
      );

      if (response.data.success) {
        setTicketData({ ...ticketData, status: "Scanned" });
        Alert.alert("Success", "Ticket status updated to Scanned.");
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={24} color="#180161" />
          </TouchableOpacity>
          <Text style={styles.heading}>Ticket Check</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Enter Ticket Number"
            placeholderTextColor={"#999"}
            style={styles.input}
            value={ticketNumber}
            onChangeText={setTicketNumber}
          />
          <TouchableOpacity
            style={styles.searchButton}
            disabled={loading}
            onPress={fetchTicketDetails}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>SEARCH</Text>
            )}
          </TouchableOpacity>
        </View>

        {hasSearched && ticketData === null && (
          <Text style={styles.noTicketText}>No ticket found</Text>
        )}

        {ticketData && (
          <View style={styles.ticketContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Ticket Booking Details</Text>
            <View style={styles.detailsContainer}>
              <TicketDetail
                label="Invoice Date"
                value={ticketData.bookingDate}
              />
              <TicketDetail
                label="Booking Person"
                value={`${ticketData.firstName} ${ticketData.lastName}`}
              />
              <TicketDetail label="Booking Ref #" value={ticketData.refNo} />
              <TicketDetail label="Event" value={ticketData.eventName} />
              <TicketDetail label="Date" value={ticketData.eventDate} />
              <TicketDetail label="Time" value={ticketData.eventTime} />
              <TicketDetail label="Ticket" value={ticketData.ticket} />
              <TicketDetail label="Serial #" value={ticketData.ticketNumber} />
              <TicketDetail label="Location" value={ticketData.location} />
              <TicketDetail label="Status" value={ticketData.status} />
            </View>
            {ticketData.status === "Not Used" && (
              <TouchableOpacity
                style={styles.useButton}
                onPress={updateTicketStatus}
              >
                <Text style={styles.useButtonText}>Use Ticket</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{hotelData.name}</Text>
        <Text style={styles.footerText}>
          {hotelData.phone} | {hotelData.email}
        </Text>
        <Text style={styles.footerText}>
          {hotelData.address}, {hotelData.city}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const CheckTaskDrawer = () => (
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

export default CheckTaskDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    padding: 5,
  },
  heading: {
    flex: 1,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginLeft: -29, // Offset for the menu button
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#180161",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noTicketText: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 20,
  },
  ticketContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#180161",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
  detailValue: {
    fontSize: 16,
    color: "#1F2937",
  },
  useButton: {
    backgroundColor: "#180161",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  useButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#180161",
    padding: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 2,
  },
});
