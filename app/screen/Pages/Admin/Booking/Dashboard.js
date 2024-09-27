import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";

const Drawer = createDrawerNavigator();
const DashboardContent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [guestlist, setGuestList] = useState([]);
  const itemsPerPage = 10;
  const isFocused = useIsFocused();
  // const guestOptions = [
  //   { label: 'Guest 1', value: 1 },
  //   { label: 'Guest 2', value: 2 },
  //   { label: 'Guest 3', value: 3 },
  // ];

  const statusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "UnPaid", value: "UnPaid" },
    //{ label: 'Cancelled', value: 'Cancelled' },
  ];

  useEffect(() => {
    if (isFocused) {
      fetchGuestDD();
      fetchData();
    }
  }, [isFocused]);

  // Function to refetch the updated room list
  const fetchGuestDD = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Guest/GetGuestDD",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setGuestList(response.data.list);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to login page
      } else {
        console.warn(error);
        Alert.alert("Error", "Failed to fetch guests.");
      }
    } finally {
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    fetchData();
  };
  const handleGuestChange = (gId) => {
    setSelectedGuest(gId);
    fetchData();
  };

  // Function to refetch the updated room list
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");

    setLoading(true);
    try {
      const response = await axios.get(
        `http://majidalipl-001-site5.gtempurl.com/Booking/GetBookings?guestId=${selectedGuest}
        &status=${selectedStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.list);

        setPages(Math.ceil(response.data.list.length / itemsPerPage));
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        navigation.navigate("Login");
      } else {
        console.warn(error);
        Alert.alert("Error", "Failed to fetch bookings.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderTableItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.referenceNumber}</Text>
      <Text style={styles.tableCell}>{item.firstName}</Text>
      <Text style={styles.tableCell}>{item.bookingDate}</Text>
      <Text style={styles.tableCell}>{item.bookingAmount}</Text>
      <Text style={styles.tableCell}>{item.paidAmount}</Text>
      <Text style={styles.tableCell}>{item.status}</Text>
      <View style={styles.tableActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("BookingDetails", { id: item.id })}
          style={styles.detailButton}
        >
          <Ionicons
            name="information-circle-outline"
            size={25}
            color="#180161"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyTable = () => (
    <View style={styles.emptyTableContainer}>
      <Text style={styles.emptyTableText}>No rows are added</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.bookingtxt}>Booking</Text>
      {/* <TouchableOpacity style={styles.nextbtn} onPress={() => navigation.navigate('Postpages')}>
      <Text style={styles.skipText}>Next page</Text>
  </TouchableOpacity> */}
      <View style={styles.options}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Guest</Text>
          <RNPickerSelect
            placeholder={{ label: "Select a guest...", value: 0 }}
            onValueChange={(value) => handleGuestChange(value)}
            items={guestlist}
            style={pickerSelectStyles}
            value={selectedGuest}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Select Status</Text>
          <RNPickerSelect
            placeholder={{ label: "Select status...", value: "" }}
            onValueChange={(value) => handleStatusChange(value)}
            items={statusOptions}
            style={pickerSelectStyles}
            value={selectedStatus}
          />
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Ref No</Text>
          <Text style={styles.headerCell}>Guest</Text>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.headerCell}>Paid</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#180161"
              style={styles.activityIndicator}
            />
          </View>
        ) : data.length > 0 ? (
          <FlatList
            data={data.slice(
              currentPage * itemsPerPage,
              (currentPage + 1) * itemsPerPage
            )}
            renderItem={renderTableItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          renderEmptyTable()
        )}
        {/* <FlatList
        data={data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        renderItem={renderTableItem}
        keyExtractor={(item) => item.id}
      /> */}
      </View>

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => handlePageChange("previous")}
          style={[
            styles.paginationButton,
            currentPage === 0 && styles.disabledButton,
          ]}
          disabled={currentPage === 0}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPage + 1} of {pages}
        </Text>
        <TouchableOpacity
          onPress={() => handlePageChange("next")}
          style={[
            styles.paginationButton,
            currentPage === pages - 1 && styles.disabledButton,
          ]}
          disabled={currentPage === pages - 1}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    backgroundColor: "white",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    backgroundColor: "white",
  },
});

const Dashboard = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "60%",
        },
      }}
    >
      <Drawer.Screen name="BookingList" component={DashboardContent} />
    </Drawer.Navigator>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
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
  bookingtxt: {
    marginTop: 17,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  options: {
    marginTop: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  tableContainer: {
    marginTop: 30,
    height: "50%",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  tableCell: {
    fontSize: 11,
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  // paginationContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginVertical: 10,
  // },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "#180161",
  },
  paginationButtonText: {
    fontSize: 14,
    color: "white",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageIndicator: {
    fontSize: 14,
  },
  nextbtn: {
    position: "absolute",
    top: 25,
    right: 20,
    BackgroundColor: "black",
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  skipText: {
    color: "blue",
    fontSize: 12,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  // tableActions: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   alignItems: "center",
  // },
  // detailButton: {
  //   backgroundColor: "#180161",
  //   borderRadius: 4,
  //   paddingVertical: 5,
  //   paddingHorizontal: 8,
  // },
  // detailButtonText: {
  //   color: "white",
  //   fontSize: 12,
  // },
  // emptyTableContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   paddingVertical: 20,
  // },
  // emptyTableText: {
  //   fontSize: 16,
  //   color: "#666",
  // },
});
