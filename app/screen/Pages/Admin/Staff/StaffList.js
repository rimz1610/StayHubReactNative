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
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik, useFormik } from "formik";
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
const addEditSchema = Yup.object().shape({
  firstName: Yup.string().max(25, "Too long").required("Required"),
  lastName: Yup.string().max(25, "Too long").required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      "1 Upper, Lowercase, 1 Number and 1 Special Character"
    ),
  phoneNumber: Yup.string().required("Required"),
});
const StaffListContent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: 0,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      isActive: false,
      isAdmin: true,
      phoneNumber: "",
    },
    validationSchema: addEditSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        values.isAdmin = true;

        setSubmitting(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Staff/AddEditStaff",
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          resetForm();
          Alert.alert("Success", "Staff saved successfully.", [
            {
              text: "OK",
              onPress: () => setModalVisible(false),
            },
          ]);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "An error occurred while saving the staff.");
        }
      } finally {
        fetchData();
        setSubmitting(false);
      }
    },
  });

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
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to fetch staffs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    formik.setValues(item);
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
              `http://majidalipl-001-site5.gtempurl.com/Staff/Delete?id=${staffId}`,
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
            Alert.alert("Error", "Failed to delete the staff account.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };
  const handleStatus = (item) => {
    const msg = item.isActive
      ? "Do you want to inactivate this item?"
      : "Do you want to activate this item?";
    Alert.alert("Are you sure?", msg, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, sure",
        onPress: async () => {
          try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
              `http://majidalipl-001-site5.gtempurl.com/Staff/ChangeStatus?id=${item.id}`,
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
            Alert.alert("Error", "Failed to change status.");
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
        {item.firstName} {item.lastName}
      </Text>

      <View style={styles.tableActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("StaffActivityList", {
              staffId: item.id,
              staffName: item.firstName + " " + item.lastName,
            })
          }
          style={styles.activityButton}
        >
          <Text style={styles.activityButtonText}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleStatus(item)}
          style={styles.activeButton}
        >
          <Text style={styles.activeButtonText}>
            {item.isActive ? "Active" : "Inactive"}
          </Text>
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

      <Text style={styles.roomheading}>Staff</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          formik.setValues({
            id: 0,
            isAdmin: false,
            isActive: false,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phoneNumber: "",
          });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Name</Text>

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
                      {formik.values.id > 0 ? "Edit Staff" : "Add New Staff"}
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
                    value={formik.values.firstName}
                    onChangeText={formik.handleChange("firstName")}
                  />

                  {formik.touched.firstName && formik.errors.firstName && (
                    <Text style={styles.errorText}>
                      {formik.errors.firstName}
                    </Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#888"
                    value={formik.values.lastName}
                    onChangeText={formik.handleChange("lastName")}
                  />

                  {formik.touched.lastName && formik.errors.lastName && (
                    <Text style={styles.errorText}>
                      {formik.errors.lastName}
                    </Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={formik.values.email}
                    onChangeText={formik.handleChange("email")}
                  />

                  {formik.touched.email && formik.errors.email && (
                    <Text style={styles.errorText}>{formik.errors.email}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#888"
                    value={formik.values.phoneNumber}
                    onChangeText={formik.handleChange("phoneNumber")}
                  />

                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <Text style={styles.errorText}>
                      {formik.errors.phoneNumber}
                    </Text>
                  )}
                  {formik.values.id == 0 && (
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#888"
                      value={formik.values.password}
                      onChangeText={formik.handleChange("password")}
                    />
                  )}
                  {formik.touched.password && formik.errors.password && (
                    <Text style={styles.errorText}>
                      {formik.errors.password}
                    </Text>
                  )}

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={[styles.button, styles.cancelButton]}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
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
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
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
  activityButton: {
    backgroundColor: "#008000",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginLeft: 1,
  },
  activityButtonText: {
    color: "white",
    fontSize: 12,
  },
  activeButton: {
    backgroundColor: "#123e66",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginLeft: 1,
  },
  activeButtonText: {
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
  errorText: {
    fontSize: 12,
    color: "red",
  },
});
