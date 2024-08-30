import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const BookingDetailsContent = ({ navigation }) => {
  const getIconForType = (type) => {
    switch (type) {
      case "Room":
        return <Ionicons name="bed-outline" size={18} color="#180161" />;
      case "Meal":
        return <Ionicons name="restaurant-outline" size={18} color="#180161" />;
      case "Service":
        return <Ionicons name="car-outline" size={18} color="#180161" />;
      default:
        return null;
    }
  };

  return (
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
            <Text style={styles.infoText}>Guest No:</Text>
            <Text style={styles.infoText}>Email:</Text>
            <Text style={styles.infoText}>Address:</Text>
            <Text style={styles.infoText}>Booking Ref no:</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoText}>Name:</Text>
            <Text style={styles.infoText}>Phone:</Text>
            <Text style={styles.infoText}>Booking Date:</Text>
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
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              {getIconForType("Room")}
              <Text> Room</Text>
            </View>
            <Text style={[styles.tableCell, styles.tableDetailCell]}>
              Deluxe Room with Sea View
            </Text>
            <Text style={styles.tableCell}>$200</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              {getIconForType("Meal")}
              <Text> Meal</Text>
            </View>
            <Text style={[styles.tableCell, styles.tableDetailCell]}>
              Breakfast Included
            </Text>
            <Text style={styles.tableCell}>$50</Text>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              {getIconForType("Service")}
              <Text> Service</Text>
            </View>
            <Text style={[styles.tableCell, styles.tableDetailCell]}>
              Airport Pickup
            </Text>
            <Text style={styles.tableCell}>$30</Text>
          </View>
        </View>

        {/* Small Table */}
        <View style={styles.smallTableContainer}>
          <View style={styles.smallTableRow}>
            <Text style={styles.smallTableHeader}>Order Total:</Text>
            <Text style={styles.smallTableAmount}>$280</Text>
          </View>
          <View style={styles.smallTableRow}>
            <Text style={styles.smallTableHeader}>Paid Amount:</Text>
            <Text style={styles.smallTableAmount}>$280</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const BookingDetails = () => {
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
    marginTop: 5,
    alignSelf: "flex-start",
  },
  linedown: {
    marginTop: 10,
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
    fontSize: 16,
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
    fontSize: 16,
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
    width: 170,
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
});
