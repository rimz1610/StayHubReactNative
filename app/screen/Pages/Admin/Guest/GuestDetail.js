import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import DrawerContent from "../../../../components/DrawerContent";

const Drawer = createDrawerNavigator();

const bookingArr = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  bookingNo: `STH-${(index + 1).toString().padStart(5, "0")}`,
  date: "2024-08-01",
  totalAmount: "$100",
  paidAmount: "$100",
  status: "Paid",
}));

const GuestDetailsContent = ({ navigation }) => {
  const [bookingData] = useState(bookingArr);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.bookingNo}</Text>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.totalAmount}</Text>
      <Text style={styles.tableCell}>{item.paidAmount}</Text>
      <Text style={styles.tableCell}>{item.status}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("BookingDetails")}
        style={styles.detailButton}
      >
        <Ionicons name="information-circle-outline" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.infoText}>12345</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoText}>John Doe</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>guest@example.com</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoText}>+1 234 567 8900</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoText}>123 Main St, City</Text>
        </View>
      </View>

      <View style={styles.linedown} />

      <Text style={styles.tableHeading}>Booking Details</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Booking No</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Total Amount</Text>
        <Text style={styles.headerCell}>Paid Amount</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader} // Set the header component
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.tableContainer} // Set height for the table container
      />
    </SafeAreaView>
  );
};

const GuestDetails = () => {
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
      />
    </Drawer.Navigator>
  );
};

export default GuestDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  bookingtxt: {
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
    fontSize: 12,
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
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
});
