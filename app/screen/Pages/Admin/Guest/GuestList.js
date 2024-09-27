import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
// Dummy data for the table
const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index,
  guestNo: "SHG-000" + index + 1,
  name: `Ali ${index + 1}`,
  email: "ali123@yahoo.com",
  phoneNumber: "03045050303",
}));

const Drawer = createDrawerNavigator();
const GuestListContent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  // Function to refetch the updated room list
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");

    setLoading(true);
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Guest/GetGuests",
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
        Alert.alert("Error", "Failed to fetch guests.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (guestId) => {
    Alert.alert("Are you sure?", "Do you want to delete this guest?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, delete it",
        onPress: async () => {
          try {
            setLoading(true);

            // Get the JWT token from AsyncStorage
            const token = await AsyncStorage.getItem("token");

            // Send the delete request
            const response = await axios.get(
              `http://majidalipl-001-site5.gtempurl.com/Guest/Delete?guestId=${guestId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.data.success) {
              // Refetch the updated list after deletion
              fetchData();
            } else {
              Alert.alert("Error", response.data.message);
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              // Redirect to login page
              navigation.navigate("Login");
            } else {
              console.warn(error);
              Alert.alert("Error", "Failed to delete the guest.");
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell} numberOfLines={1}>
        {item.guestNumber}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1}>
        {item.email}
      </Text>
      <View style={styles.tableActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate("GuestDetails", { id: item.id })}
          style={styles.detailButton}
        >
          <Text style={styles.detailButtonText}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
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

      <Text style={styles.roomheading}>Guest</Text>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Guest No</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Phone Number</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
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
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          renderEmptyTable()
        )}
      </View>

      {/* Pagination */}
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
const GuestList = () => {
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
      <Drawer.Screen name="GuestListContent" component={GuestListContent} />
    </Drawer.Navigator>
  );
};

export default GuestList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  roomheading: {
    marginTop: 23,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  addButton: {
    marginTop: 30,
    alignSelf: "flex-end",
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  tableContainer: {
    width: "100%",
    height: "50%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 70,
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
    textAlign: "center",
    paddingVertical: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#007BFF",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginLeft: 1,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
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
  detailButton: {
    backgroundColor: "#007BFF",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  detailButtonText: {
    color: "white",
    fontSize: 12,
  },
});
