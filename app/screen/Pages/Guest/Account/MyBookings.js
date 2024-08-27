import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const UserInfo = ({ name, email, phone }) => (
  <View style={styles.userInfoContainer}>
    <Text style={styles.userInfoTitle}>User Information</Text>
    <View style={styles.userInfoContent}>
      <Text style={styles.userInfoText}>Name: {name}</Text>
      <Text style={styles.userInfoText}>Email: {email}</Text>
      <Text style={styles.userInfoText}>Phone: {phone}</Text>
    </View>
  </View>
);

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.headerText, styles.bookingNoColumn]}>Booking No</Text>
    <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
    <Text style={[styles.headerText, styles.totalColumn]}>Total</Text>
    <Text style={[styles.headerText, styles.statusColumn]}>Status</Text>
    <Text style={[styles.headerText, styles.actionColumn]}>Action</Text>
  </View>
);

const BookingItem = ({ item, onPressReceipt }) => (
  <View style={styles.bookingItem}>
    <Text style={[styles.bookingText, styles.bookingNoColumn]}>
      {item.bookingNo}
    </Text>
    <Text style={[styles.bookingText, styles.dateColumn]}>{item.date}</Text>
    <Text style={[styles.bookingText, styles.totalColumn]}>${item.total}</Text>
    <View style={[styles.statusColumn, styles.statusContainer]}>
      <Text style={[styles.statusText, styles[item.status.toLowerCase()]]}>
        {item.status}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => onPressReceipt(item)}
      style={styles.actionColumn}
    >
      <Icon name="receipt" size={24} color="#180161" />
    </TouchableOpacity>
  </View>
);

const MyBookings = () => {
  const userInfo = {
    name: "Fatima Zuhra",
    email: "fatima345@yahoo.com",
    phone: "+1 234 567 8900",
  };

  const bookings = [
    {
      id: "1",
      bookingNo: "BK001",
      date: "2024-08-15",
      total: 150,
      status: "Confirmed",
    },
    {
      id: "2",
      bookingNo: "BK002",
      date: "2024-08-20",
      total: 200,
      status: "Pending",
    },
    {
      id: "3",
      bookingNo: "BK003",
      date: "2024-08-25",
      total: 180,
      status: "Cancelled",
    },
    // Add more dummy data as needed
  ];

  const handleReceiptPress = (booking) => {
    // Navigate to receipt screen
    console.log("Navigate to receipt for booking:", booking.MyBookingReceipt);
  };

  return (
    <ScrollView style={styles.container}>
      <UserInfo {...userInfo} />
      <Text style={styles.recentBookingsTitle}>Recent Bookings</Text>
      <View style={styles.tableContainer}>
        <TableHeader />
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingItem item={item} onPressReceipt={handleReceiptPress} />
          )}
          scrollEnabled={false}
        />
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
  userInfoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 12,
  },
  userInfoContent: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  recentBookingsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 12,
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#180161",
    textAlign: "center",
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  bookingText: {
    textAlign: "center",
  },
  bookingNoColumn: { width: "20%" },
  dateColumn: { width: "24%" },
  totalColumn: { width: "16%" },
  statusColumn: { width: "24%" },
  actionColumn: { width: "16%", alignItems: "center" },
  statusContainer: {
    alignItems: "center",
  },
  statusText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
  confirmed: {
    backgroundColor: "#e6f7ed",
    color: "#1e7e34",
  },
  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  cancelled: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
});

export default MyBookings;
