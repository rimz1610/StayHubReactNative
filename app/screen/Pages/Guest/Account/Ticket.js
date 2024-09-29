import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const TicketDetail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const Ticket = ({ route, navigation }) => {
  const viewShotRef = useRef();
  const bookingId = route.params?.bookingId || 0;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const ticket = {
    id: 0,
    bookingDate: "",
    refNo: "",
    eventName: "",
    firstName: "",
    lastName: "",
    ticket: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketNumber: "",
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, bookingId]);

  // Function to refetch the updated room list
  const fetchData = async () => {
    if (bookingId > 0) {
      const token = await AsyncStorage.getItem("token");

      setLoading(true);
      try {
        const response = await axios.get(
          "http://majidalipl-001-site5.gtempurl.com/Ticket/GetTicketList?bookingId=" +
            bookingId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setData(response.data.list);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "Failed to fetch ticket details.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Sample data - replace with actual data in a real app
  const ticketData = {
    invoiceDate: "17 Aug 2024",
    bookingPerson: "Fatima Zuhra",
    bookingRef: "STH-00066",
    eventName: "Opera - 23 Sept",
    eventDate: "Thu 12 September 2024",
    timings: "09:00AM-05:00PM",
    ticketType: "Child",
    serialNo: "04020",
  };

  const hotelData = {
    phone: "+1 884-6789-9876",
    email: "info@stayhub.com",
    name: "StayHub Hotel & Resort",
    address: "346 Matangi Road",
    city: "Albama, 23456, United States",
  };

  const downloadTicket = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow access to save the ticket."
        );
        return;
      }

      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Tickets", asset, false);

      Alert.alert("Success", "Ticket saved to gallery!");

      // Optionally, you can also share the ticket
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save ticket image.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("BookingReceipt")}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Tickets</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadTicket}
        >
          <Icon name="file-download" size={20} color="white" />
          <Text style={styles.downloadButtonText}>Download Ticket</Text>
        </TouchableOpacity>

        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={styles.viewShot}
        >
          {data != undefined &&
            data.map((ticketItem, index) => {
              return (
                <>
                  <View key={index} style={styles.ticketContainer}>
                    <Image
                      source={{ uri: "https://via.placeholder.com/100" }}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                    <View style={styles.detailsContainer}>
                      <TicketDetail
                        label="Invoice Date"
                        value={ticketItem.bookingDate}
                      />
                      <TicketDetail
                        label="Booking Person"
                        value={ticketItem.firstName+" "+ticketItem.lastName}
                      />
                      <TicketDetail
                        label="Booking Ref #"
                        value={ticketItem.refNo}
                      />
                      <TicketDetail
                        label="Event"
                        value={ticketItem.eventName}
                      />
                      <TicketDetail label="Date" value={ticketItem.eventDate} />
                      <TicketDetail label="Time" value={ticketItem.eventTime} />
                      <TicketDetail label="Ticket" value={ticketItem.ticket} />
                      <TicketDetail
                        label="Serial #"
                        value={ticketItem.ticketNumber}
                      />
                       <TicketDetail
                        label="Location"
                        value={ticketItem.location}
                      />
                    </View>
                  </View>
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>{hotelData.phone}</Text>
                    <Text style={styles.footerText}>{hotelData.email}</Text>
                    <Text style={styles.footerText}>{hotelData.name}</Text>
                    <Text style={styles.footerText}>{hotelData.address}</Text>
                    <Text style={styles.footerText}>{hotelData.city}</Text>
                  </View>
                </>
              );
            })}
        </ViewShot>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#180161",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  viewShot: {
    backgroundColor: "white", // Set background color to white
    padding: 16, // Optional: add padding if needed
    borderRadius: 8, // Optional: keep the rounded corners
  },

  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40, // To balance the header layout
  },
  downloadButton: {
    width: "50%",
    backgroundColor: "#27496d",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 14,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // header: {
  //   // backgroundColor: "#dfe4ea",
  //   paddingVertical: 20,
  //   alignItems: "center",
  // },
  // headerTitle: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   color: "#2f3640",
  // },
  ticketContainer: {
    backgroundColor: "#27496d",
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
  detailsContainer: {
    alignItems: "center",
  },
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

export default Ticket;
