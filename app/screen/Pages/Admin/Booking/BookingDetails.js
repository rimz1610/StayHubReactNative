import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();

const BookingDetailsContent = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const bookingId = route.params?.id || 0;
  const isFocused = useIsFocused();
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
          "http://majidalipl-001-site5.gtempurl.com/Booking/GetBookingDetail?bookingId=" +
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

  const getIconForType = (type) => {
    switch (type) {
      case "Room":
        return (
          <Ionicons
            name="bed-outline"
            size={18}
            color="#180161"
            marginHorizontal={29}
          />
        );
      case "Event":
        return (
          <Ionicons
            name="restaurant-outline"
            size={18}
            color="#180161"
            marginHorizontal={29}
          />
        );
      case "RoomService":
        return (
          <Ionicons
            name="car-outline"
            size={18}
            color="#180161"
            marginHorizontal={29}
          />
        );
      case "Gym":
        return (
          <Ionicons
            name="fitness"
            size={18}
            color="#180161"
            marginHorizontal={29}
          />
        );
      case "Spa":
        return (
          <Ionicons
            name="water"
            size={18}
            color="#180161"
            marginHorizontal={29}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.ScrollView}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.bookingtxt}>Booking Details</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
          style={styles.backbtn}
        >
          <Text style={styles.backbtnText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.guestDetailsHeading}>Guest Details</Text>

        {/* Black Line */}
        <View style={styles.lineup} />

        {/* Guest Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoText}>
                Guest No: {data.booking.guestNumber}
              </Text>
              <Text style={styles.infoText}>Email: {data.booking.email}</Text>

              <Text style={styles.infoText}>
                Booking Ref no: {data.booking.referenceNumber}
              </Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoText}>
                Name: {data.booking.firstName} {data.booking.lastName}
              </Text>
              <Text style={styles.infoText}>Phone: {data.booking.phone}</Text>
              <Text style={styles.infoText}>
                Booking Date: {data.booking.bookingDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Black Line */}
        <View style={styles.linedown} />

        {/* Table Heading */}
        <Text style={styles.tableHeading}>Items Details</Text>

        {/* Table Container */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Type</Text>
              <Text style={styles.tableHeaderText}>Details</Text>
              <Text style={styles.tableHeaderText}>Price</Text>
            </View>
            {data.bookingType.length > 0 &&
              data.bookingType.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    {getIconForType(item.typeName)}
                  </View>
                  <Text style={[styles.tableCell, styles.tableDetailCell]}>
                    {item.description}
                  </Text>
                  <Text style={styles.tableCell}>{item.amount}</Text>
                </View>
              ))}
          </View>

          {/* Small Table */}
          <View style={styles.smallTableContainer}>
            <View style={styles.smallTableRow}>
              <Text style={styles.smallTableHeader}>Booking Amount:</Text>
              <Text style={styles.smallTableAmount}>
                {data.booking.bookingAmount}
              </Text>
            </View>

            <View style={styles.smallTableRow}>
              <Text style={styles.smallTableHeader}>Paid Amount:</Text>
              <Text style={styles.smallTableAmount}>
                {data.booking.paidAmount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const BookingDetails = ({ route }) => {
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
        name="BookingDetailsContent"
        component={BookingDetailsContent}
        initialParams={{ id: id }}
      />
    </Drawer.Navigator>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  ScrollView: {
    flex: 1,
  },
  bookingtxt: {
    marginTop: 35,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  backbtn: {
    marginTop: 10,
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
    marginTop: 5,
    alignSelf: "flex-start",
  },
  linedown: {
    marginTop: 5,
    height: 1,
    backgroundColor: "black",
    width: "100%",
    marginVertical: 10,
  },
  lineup: {
    height: 1,
    backgroundColor: "black",
    width: "100%",
    marginVertical: 10,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 8,
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
  tableContainer: {
    width: "100%",
    height: "58%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 2,
    justifyContent: "space-between",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
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
    fontSize: 13,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  smallTableAmount: {
    fontSize: 15,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
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
});
