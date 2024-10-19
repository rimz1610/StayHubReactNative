import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const UserInfo = (guestData) => (
  <View style={styles.userInfoContainer}>
    <Text style={styles.userInfoTitle}>Guest Information</Text>
    <View style={styles.userInfoContent}>
      <Text style={styles.userInfoText}>Guest Number: {guestData.guestNo}</Text>
      <Text style={styles.userInfoText}>Name: {guestData.name}</Text>
      <Text style={styles.userInfoText}>Email: {guestData.email}</Text>
    </View>
  </View>
);

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.headerText, styles.bookingNoColumn]}>Ref No</Text>
    <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
    <Text style={[styles.headerText, styles.totalColumn]}>Total</Text>
    <Text style={[styles.headerText, styles.statusColumn]}>Status</Text>
    <Text style={[styles.headerText, styles.actionColumn]}>Action</Text>
  </View>
);
const renderEmptyTable = () => (
  <View style={styles.emptyTableContainer}>
    <Text style={styles.emptyTableText}>No rows are added</Text>
  </View>
);
const BookingItem = ({ item, onPressReceipt }) => (
  <View style={styles.bookingItem}>
    <Text style={[styles.bookingText, styles.bookingNoColumn]}>
      {item.referenceNumber}
    </Text>
    <Text style={[styles.bookingText, styles.dateColumn]}>
      {item.bookingDate}
    </Text>
    <Text style={[styles.bookingText, styles.totalColumn]}>
      {item.bookingAmount}
    </Text>
    <View style={[styles.statusColumn, styles.statusContainer]}>
      <Text style={[styles.statusText, styles[item.status.toLowerCase()]]}>
        {item.status}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => onPressReceipt(item.id)}
      style={styles.actionColumn}
    >
      <Icon name="receipt" size={24} color="#180161" />
    </TouchableOpacity>
  </View>
);

const MyBookings = () => {
  const navigation = useNavigation();
  const [guestData, setGuestData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const fetchData = async () => {
    setLoading(true);
    const guestId = await AsyncStorage.getItem("loginId");
    const token = await AsyncStorage.getItem("token");
    setGuestData({
      guestNo: await AsyncStorage.getItem("guestNo"),
      name: await AsyncStorage.getItem("name"),
      email: await AsyncStorage.getItem("email"),
      profile: await AsyncStorage.getItem("profile"),
    });
    const status = "";
    try {
      const response = await axios.get(
        `http://tehreemimran-001-site1.htempurl.com/Booking/GetBookings?guestId=${guestId}
          &status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookingData(response.data.list);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to fetch bookings.");
      }
    } finally {
      setLoading(false);
    }
  };
  const renderLoader = () => {
    return loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#180161"
          style={styles.activityIndicator}
        />
      </View>
    ) : null;
  };
  // const userInfo = {
  //   name: "Fatima Zuhra",
  //   email: "fatima345@yahoo.com",
  //   phone: "+1 234 567 8900",
  // };

  // const bookings = [
  //   {
  //     id: "1",
  //     bookingNo: "BK001",
  //     date: "2024-08-15",
  //     total: 150,
  //     status: "Confirmed",
  //   },
  //   {
  //     id: "2",
  //     bookingNo: "BK002",
  //     date: "2024-08-20",
  //     total: 200,
  //     status: "Pending",
  //   },
  //   {
  //     id: "3",
  //     bookingNo: "BK003",
  //     date: "2024-08-25",
  //     total: 180,
  //     status: "Cancelled",
  //   },
  //   // Add more dummy data as needed
  // ];

  const handleReceiptPress = (bookingId) => {
    // Navigate to MyBookingReceipt screen with booking data
    navigation.navigate("BookingReceipt", { id: bookingId });
  };
  return (
    <ScrollView style={styles.container}>
      <UserInfo {...guestData} />
      <Text style={styles.recentBookingsTitle}>Recent Bookings</Text>
      <View style={styles.tableContainer}>
        <TableHeader />
        <FlatList
          data={bookingData}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={loading ? renderLoader() : renderEmptyTable}
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
  emptyTableContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyTableText: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  activityIndicator: {
    padding: 20,
  },
});

export default MyBookings;
