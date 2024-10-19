import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  View,
  Alert,
  Keyboard,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  // ActivityIndicator,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import DrawerContent from "../../../../components/DrawerContent";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const Drawer = createDrawerNavigator();

const bookingArr = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  bookingNo: `STH-${(index + 1).toString().padStart(5, "0")}`,
  date: "2024-08-01",
  totalAmount: "$100",
  paidAmount: "$100",
  status: "Paid",
}));

const GuestDetailsContent = ({ route, navigation }) => {
  const [guestData, setGuestData] = useState({});
  const [bookingData, setBookingData] = useState([]);
  const guestId = route.params?.id || 0;
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(0);
  const [bookingDetail, setBookingDetail] = useState({
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
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, guestId]);
  const handleBookingDetail = (bId) => {
    setCurrentBookingId(bId);
    fetchBookingDetail();
  };
  // Function to refetch the updated room list
  const fetchData = async () => {
    if (guestId > 0) {
      const token = await AsyncStorage.getItem("token");
      setLoading(true);
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
          Alert.alert("Error", "Failed to fetch booking details.");
        }
      } finally {
        setLoading(false);
      }
      try {
        const response2 = await axios.get(
          `http://tehreemimran-001-site1.htempurl.com/Guest/GetGuestById?guestId=${guestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response2.data.success) {
          setGuestData(response2.data.data);
        } else {
          Alert.alert("Error", response2.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "Failed to fetch guest details.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchBookingDetail = async () => {
    if (currentBookingId > 0) {
      const token = await AsyncStorage.getItem("token");

      setLoading(true);
      try {
        const response = await axios.get(
          "http://tehreemimran-001-site1.htempurl.com/Booking/GetBookingDetail?bookingId=" +
            currentBookingId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setBookingDetail(response.data.data);
          setModalVisible(true);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "Failed to fetch booking details.");
        }
      } finally {
        setLoading(false);
      }
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
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.referenceNumber}</Text>
      <Text style={styles.tableCell}>{item.bookingDate}</Text>
      <Text style={styles.tableCell}>{item.bookingAmount}</Text>
      <Text style={styles.tableCell}>{item.paidAmount}</Text>
      <Text style={styles.tableCell}>{item.status}</Text>
      <TouchableOpacity
        onPress={() => handleBookingDetail(item.id)}
        style={styles.detailButton}
      >
        <Ionicons name="information-circle-outline" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
  const getIconForType = (type) => {
    switch (type) {
      case "Room":
        return <Ionicons name="bed-outline" size={18} color="#180161" />;
      case "Event":
        return <Ionicons name="restaurant-outline" size={18} color="#180161" />;
      case "RoomService":
        return <Ionicons name="car-outline" size={18} color="#180161" />;
      case "Gym":
        return <Ionicons name="fitness" size={18} color="#180161" />;
      case "Spa":
        return <Ionicons name="water" size={18} color="#180161" />;
      default:
        return null;
    }
  };
  // Create a header component to display above the FlatList
  const renderHeader = () => (
    <View>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.bookingtxt}>Guest Details</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("GuestList")}
        style={styles.backbtn}
      >
        <Text style={styles.backbtnText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.guestDetailsHeading}>Guest Details</Text>
      <View style={styles.lineup} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Guest No:</Text>
          <Text style={styles.infoText}>{guestData.guestNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoText}>
            {guestData.firstName} {guestData.lastName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>{guestData.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoText}>{guestData.phoneNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoText}>
            {guestData.address} {guestData.city} {guestData.state}{" "}
            {guestData.zipcode}
          </Text>
        </View>
      </View>

      <View style={styles.linedown} />

      <Text style={styles.tableHeading}>Booking Details</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Ref No</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Total</Text>
        <Text style={styles.headerCell}>Paid</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>
    </View>
  );

  const renderEmptyTable = () => (
    <View style={styles.emptyTableContainer}>
      <Text style={styles.emptyTableText}>No rows are added</Text>
    </View>
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={bookingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader} // Set the header component
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={loading ? renderLoader() : renderEmptyTable}
        showsVerticalScrollIndicator={false}
        style={styles.tableContainer} // Set height for the table container
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <ScrollView
                  contentContainerStyle={styles.modalScrollViewContent}
                >
                  <View style={styles.header}>
                    <Text style={styles.modalTitle}>Booking Details</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tableWrapper}>
                    <View style={styles.tableContainer}>
                      <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Type</Text>
                        <Text style={styles.tableHeaderText}>Details</Text>
                        <Text style={styles.tableHeaderText}>Price</Text>
                      </View>
                      {bookingDetail.bookingType.length > 0 &&
                        bookingDetail.bookingType.map((ele, index) => (
                          <View key={index} style={styles.tableRow}>
                            <View style={styles.tableCell}>
                              {getIconForType(ele.typeName)}
                            </View>
                            <Text
                              style={[styles.tableCell, styles.tableDetailCell]}
                            >
                              {ele.description}
                            </Text>
                            <Text style={styles.tableCell}>{ele.amount}</Text>
                          </View>
                        ))}
                    </View>

                    {/* Small Table */}
                    <View style={styles.smallTableContainer}>
                      <View style={styles.smallTableRow}>
                        <Text style={styles.smallTableHeader}>
                          Booking Amount:
                        </Text>
                        <Text style={styles.smallTableAmount}>
                          {bookingDetail.booking.bookingAmount}
                        </Text>
                      </View>

                      <View style={styles.smallTableRow}>
                        <Text style={styles.smallTableHeader}>
                          Paid Amount:
                        </Text>
                        <Text style={styles.smallTableAmount}>
                          {bookingDetail.booking.paidAmount}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const GuestDetails = ({ route }) => {
  const { id } = route.params || {};
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
      <Drawer.Screen
        name="GuestsDetailsContent"
        component={GuestDetailsContent}
        initialParams={{ id: id }}
      />
    </Drawer.Navigator>
  );
};

export default GuestDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 10,
  },
  bookingtxt: {
    marginTop: 30,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  backbtn: {
    alignSelf: "flex-end",
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  backbtnText: {
    color: "white",
    fontSize: 13,
  },
  guestDetailsHeading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  lineup: {
    height: 1,
    backgroundColor: "black",
    width: "100%",
    marginVertical: 10,
  },
  linedown: {
    height: 1,
    backgroundColor: "black",
    width: "100%",
    marginVertical: 10,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
  },
  infoText: {
    flex: 2,
    fontSize: 14,
  },
  tableHeading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 20,
    alignSelf: "flex-start",
  },
  tableContainer: {
    height: 100, // Set height for the FlatList (table) container
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "white",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    textAlign: "center",
  },
  detailButton: {
    backgroundColor: "#180161",
    padding: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  tableHeading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 20,
    alignSelf: "flex-start",
  },
  tableWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  modalScrollViewContent: {
    padding: 20,
  },
  tableContainer: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  tableCell: {
    // fontWeight: "bold",
    fontSize: 10,
    flex: 1,
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  tableDetailCell: {
    flex: 2, // Makes the Details column wider
    textAlign: "center",
  },
  smallTableContainer: {
    width: 250,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#f9f9f9",
    alignSelf: "flex-end", // Aligns the small table to the right side
  },
  smallTableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 5,
  },
  smallTableHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  smallTableAmount: {
    fontSize: 16,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#180161",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
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
