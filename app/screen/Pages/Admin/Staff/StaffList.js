import RNPickerSelect from "react-native-picker-select";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
// Dummy data for the table
const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  name: `Ali ${index + 1}`,
  email: "ali123@yopmail.com",
  phoneNumber: `03456050369`,
}));

const Drawer = createDrawerNavigator();
const StaffListContent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const itemsPerPage = 10;
  const pages = Math.ceil(data.length / itemsPerPage);
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
        "http://majidalipl-001-site5.gtempurl.com/Staff/GetStaffs",
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
      console.warn(error);
      Alert.alert("Error", "Failed to fetch staffs.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = (staffId) => {
    Alert.alert("Are you sure?", "Do you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, delete it",
        onPress: async () => {
          try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
              `http://majidalipl-001-site5.gtempurl.com/Staff/DeleteStaff?id=${staffId}`,
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
            console.warn(error);
            Alert.alert("Error", "Failed to delete the staff account.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleSave = () => {
    if (editMode) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? { ...currentItem } : item
        )
      );
    } else {
      setData((prevData) => [
        ...prevData,
        { ...currentItem, id: Date.now().toString() },
      ]);
    }
    setModalVisible(false);
    setCurrentItem(null);
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
        {item.id}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1}>
        {item.nam}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1}>
        {item.email}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1}>
        {item.phoneNumber}
      </Text>
      <View style={styles.tableActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("StaffActivityList")}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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

      <Text style={styles.roomheading}>Staff</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditMode(false);
          setCurrentItem({
            name: "",
            type: "",
            shortDescription: "",
            status: "",
          });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Id</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Phone No</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
        </View>
        <FlatList
          data={data.slice(
            currentPage * itemsPerPage,
            (currentPage + 1) * itemsPerPage
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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

      {/* Modal for adding/editing */}
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
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  <View style={styles.header}>
                    <Text style={styles.modalTitle}>
                      {editMode ? "Edit Staff" : "Add New Staff"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#888"
                    value={currentItem?.name}
                    onChangeText={(text) =>
                      setCurrentItem({ ...currentItem, name: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#888"
                    value={currentItem?.type}
                    onChangeText={(text) =>
                      setCurrentItem({ ...currentItem, type: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={currentItem?.shortDescription}
                    onChangeText={(text) =>
                      setCurrentItem({ ...currentItem, shortDescription: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#888"
                    value={currentItem?.status}
                    onChangeText={(text) =>
                      setCurrentItem({ ...currentItem, status: text })
                    }
                  />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={[styles.button, styles.cancelButton]}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      style={[styles.button, styles.saveButton]}
                    >
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
const StaffList = () => {
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
      <Drawer.Screen name="StaffListContent" component={StaffListContent} />
    </Drawer.Navigator>
  );
};

export default StaffList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  roomheading: {
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
  scrollViewContent: {
    flexGrow: 1,
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#888",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  saveButton: {
    backgroundColor: "#180161",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
