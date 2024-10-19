import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ReceiptHeader = ({ hotel }) => (
  <View style={styles.header}>
    <Text style={styles.hotelName}>{hotel.name}</Text>
    <Text style={styles.hotelInfo}>{hotel.location}</Text>
    <Text style={styles.hotelInfo}>{hotel.country}</Text>
    <Text style={styles.hotelInfo}>Admin: {hotel.adminEmail}</Text>
  </View>
);

const ReceiptInfo = ({ invoice }) => (
  <View style={styles.receiptInfo}>
    <Text style={styles.receiptInfoText}>Date: {invoice.bookingDate}</Text>
    <Text style={styles.receiptInfoText}>
      Booking Person: {invoice.firstName} {invoice.lastName}
    </Text>
    <Text style={styles.receiptInfoText}>
      Reference No: {invoice.referenceNumber}
    </Text>
  </View>
);

const BookingItem = (item) => (
  <View style={styles.bookingItem}>
    <View style={styles.bookingItemLeft}>
      <Text style={styles.bookingItemName}>{item.typeName}</Text>
      <Text style={styles.bookingItemDetails}>{item.description}</Text>
    </View>
    <Text style={styles.bookingItemTotal}>{item.amount}</Text>
  </View>
);

const TotalSection = ({ paid, total }) => (
  <View style={styles.totalSection}>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total Amount</Text>
      <Text style={[styles.totalValue, styles.totalAmount]}>{total}</Text>
    </View>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Paid Amount</Text>
      <Text style={styles.totalValue}>{paid}</Text>
    </View>
  </View>
);

const BookingReceipt = ({ route, navigation }) => {
  const bookingId = route.params?.id || 0;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    booking: {
      id: 0,
      guestNumber: "",
      firstName: "",
      lastName: "",
      bookingDate: "",
      bookingAmount: "",
      paidAmount: "",
      email: "",
      phone: "",
      location: "",
      referenceNumber: "",
      notes: "",
      paidDate: "",
      status: "",
      creditCard: "",
      guestId: 0,
      txnRef: "",
    },
    bookingType: [
      {
        typeId: 0,
        typeName: "",
        description: "",
        amount: "",
      },
    ],
  });
  const receiptData = {
    hotel: {
      name: "StayHub Hotel & Resort",
      location: "123 Paradise Street",
      country: "Tropical Island",
      adminEmail: "info@stayhub.com",
    },
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, bookingId]);

  const fetchData = async () => {
    if (bookingId > 0) {
      const token = await AsyncStorage.getItem("token");

      setLoading(true);
      try {
        const response = await axios.get(
          "http://tehreemimran-001-site1.htempurl.com/Booking/GetBookingDetail?bookingId=" +
            bookingId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setData(response.data.data);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "Failed to fetch booking details.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {data.booking.hasBookedEvent == true && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() =>
            navigation.navigate("Ticket", { bookingId: data.booking.id })
          }
        >
          <Icon name="file-download" size={20} color="white" />
          <Text style={styles.downloadButtonText}>Download Ticket</Text>
        </TouchableOpacity>
      )}
      <View style={styles.receipt}>
        <ReceiptHeader hotel={receiptData.hotel} />
        <ReceiptInfo invoice={data.booking} />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Booking Details</Text>
        {data.bookingType.map((booking, index) => (
          <BookingItem key={index} {...booking} />
        ))}

        <View style={styles.divider} />

        <TotalSection
          paid={data.booking.paidAmount}
          total={data.booking.bookingAmount}
        />

        <View style={styles.divider} />

        <Text style={styles.thankYouMessage}>
          Thank you for choosing StayHub Hotel & Resort. We hope you enjoyed
          your stay!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  receipt: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 8,
  },
  hotelInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  receiptInfo: {
    marginBottom: 20,
  },
  receiptInfoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 12,
    marginTop: 12,
  },
  bookingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingItemLeft: {
    flex: 1,
  },
  bookingItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookingItemDetails: {
    fontSize: 14,
    color: "#666",
  },
  bookingItemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
  },
  totalSection: {
    marginTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
  },
  totalAmount: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  thankYouMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
  downloadButton: {
    width: "50%",
    backgroundColor: "#180161",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default BookingReceipt;
