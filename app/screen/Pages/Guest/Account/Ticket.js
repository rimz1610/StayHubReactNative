import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const TicketDetail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const Ticket = () => {
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
    email: "admin@stayhub.com",
    name: "StayHub Hotel & Resort",
    address: "346 Matangi Road",
    city: "Albama, 23456, United States",
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ticket Booking Details</Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => navigation.navigate("Ticket")}
      >
        <Icon name="file-download" size={20} color="white" />
        <Text style={styles.downloadButtonText}>Download Receipt</Text>
      </TouchableOpacity>
      {/* Ticket Section */}
      <View style={styles.ticketContainer}>
        {/* Logo Section */}
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Replace with actual logo URL
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Ticket Details */}
        <View style={styles.detailsContainer}>
          <TicketDetail label="Invoice Date" value={ticketData.invoiceDate} />
          <TicketDetail
            label="Booking Person"
            value={ticketData.bookingPerson}
          />
          <TicketDetail label="Booking Ref #" value={ticketData.bookingRef} />
          <TicketDetail label="Event" value={ticketData.eventName} />
          <TicketDetail label="Date" value={ticketData.eventDate} />
          <TicketDetail label="Time" value={ticketData.timings} />
          <TicketDetail label="Ticket" value={ticketData.ticketType} />
          <TicketDetail label="Serial #" value={ticketData.serialNo} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{hotelData.phone}</Text>
        <Text style={styles.footerText}>{hotelData.email}</Text>
        <Text style={styles.footerText}>{hotelData.name}</Text>
        <Text style={styles.footerText}>{hotelData.address}</Text>
        <Text style={styles.footerText}>{hotelData.city}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
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
  header: {
    // backgroundColor: "#dfe4ea",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2f3640",
  },
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
