import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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
    <Text style={styles.receiptInfoText}>Date: {invoice.invoiceDate}</Text>
    <Text style={styles.receiptInfoText}>
      Booking Person: {invoice.bookingPerson}
    </Text>
    <Text style={styles.receiptInfoText}>
      Reference No: {invoice.referenceNo}
    </Text>
  </View>
);

const BookingItem = ({ name, details, totalItem }) => (
  <View style={styles.bookingItem}>
    <View style={styles.bookingItemLeft}>
      <Text style={styles.bookingItemName}>{name}</Text>
      <Text style={styles.bookingItemDetails}>{details}</Text>
    </View>
    <Text style={styles.bookingItemTotal}>${totalItem.toFixed(2)}</Text>
  </View>
);

const TotalSection = ({ subtotal, paid, total }) => (
  <View style={styles.totalSection}>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Subtotal</Text>
      <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
    </View>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Paid Amount</Text>
      <Text style={styles.totalValue}>${paid.toFixed(2)}</Text>
    </View>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total</Text>
      <Text style={[styles.totalValue, styles.totalAmount]}>
        ${total.toFixed(2)}
      </Text>
    </View>
  </View>
);

const Receipt = ({ route }) => {
  // In a real app, you'd get this data from route.params or an API call
  const receiptData = {
    hotel: {
      name: "StayHub Hotel & Resort",
      location: "123 Paradise Street",
      country: "Tropical Island",
      adminEmail: "admin@stayhub.com",
    },
    invoice: {
      invoiceDate: "2024-08-28",
      bookingPerson: "Fatima Zuhra",
      referenceNo: "BK001",
    },
    bookings: [
      { name: "Deluxe Room", details: "2 nights, Ocean View", totalItem: 300 },
      {
        name: "Event Booking",
        details: "Conference Room A, 1 day",
        totalItem: 200,
      },
      { name: "Gym Access", details: "2 days pass", totalItem: 40 },
      {
        name: "Spa Treatment",
        details: "Full Body Massage, 60 mins",
        totalItem: 120,
      },
      { name: "Room Service", details: "Cleaning, 2 times", totalItem: 50 },
    ],
    subtotal: 710,
    paid: 710,
    total: 710,
  };

  const generateReceiptContent = () => {
    return `
StayHub Hotel & Resort Receipt
------------------------------
Date: ${receiptData.invoice.invoiceDate}
Booking Person: ${receiptData.invoice.bookingPerson}
Reference No: ${receiptData.invoice.referenceNo}

Booking Details:
${receiptData.bookings
  .map(
    (booking) =>
      `${booking.name} - ${booking.details}: $${booking.totalItem.toFixed(2)}`
  )
  .join("\n")}

Subtotal: $${receiptData.subtotal.toFixed(2)}
Paid Amount: $${receiptData.paid.toFixed(2)}
Total: $${receiptData.total.toFixed(2)}

Thank you for choosing StayHub Hotel & Resort. We hope you enjoyed your stay!
    `;
  };

  const handleDownload = async () => {
    const content = generateReceiptContent();
    const fileName = `Receipt_${receiptData.invoice.referenceNo}.txt`;

    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const uri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "text/plain"
        );
        await FileSystem.writeAsStringAsync(uri, content, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        console.log("File has been saved to", uri);
      } else {
        console.log("Permission not granted");
      }
    } else {
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Icon name="file-download" size={20} color="white" />
        <Text style={styles.downloadButtonText}>Download Receipt</Text>
      </TouchableOpacity>
      <View style={styles.receipt}>
        <ReceiptHeader hotel={receiptData.hotel} />
        <ReceiptInfo invoice={receiptData.invoice} />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Booking Details</Text>
        {receiptData.bookings.map((booking, index) => (
          <BookingItem key={index} {...booking} />
        ))}

        <View style={styles.divider} />

        <TotalSection
          subtotal={receiptData.subtotal}
          paid={receiptData.paid}
          total={receiptData.total}
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

export default Receipt;
