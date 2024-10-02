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
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
// Dummy data for the table
const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index,
  name: `Room Cleaning`,
  date: "01/08/2024",
  description: `Please clean floor 1 rooms.`,
}));
const Drawer = createDrawerNavigator();
const addEditSchema = Yup.object().shape({
  staffId: Yup.number().required("Required"),
  activityName: Yup.string().max(25, "Too long").required("Required"),
  activityDate: Yup.date().required("Required"),
  activityDescription: Yup.string().required("Required"),

});
const StaffActivitiesContent = ({ route, navigation }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const staffId = route.params?.staffId || 0;
  const staffName = route.params?.staffName || "";
  const [showActivityDate, setShowActivityDate] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: 0,
      staffId: staffId,
      activityName: "",
      activityDate: new Date(),
      activityDescription: "",
    },
    validationSchema: addEditSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Staff/SaveActivity",
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          resetForm();
          Alert.alert("Success", "Activity saved successfully.", [
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
          Alert.alert("Error", "An error occurred while saving the activity.");
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
    if (staffId > 0) {
      const token = await AsyncStorage.getItem("token");

      setLoading(true);
      try {
        const response = await axios.get(
          "http://majidalipl-001-site5.gtempurl.com/Staff/GetStaffActivities?id=" +
            staffId,
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
          Alert.alert("Error", "Failed to fetch activities.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (item) => {
    var obj = {
      id: item.id,
      staffId: staffId,
      activityName: item.activityName,
      activityDate: new Date(item.activityDate),
      activityDescription: item.activityDescription,
    };
    formik.setValues(obj);
    setModalVisible(true);
  };

  const handleDelete = (activityId) => {
    Alert.alert("Are you sure?", "Do you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, delete it",
        onPress: async () => {
          try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(
              `http://majidalipl-001-site5.gtempurl.com/Staff/DeleteActivity?id=${activityId}`,
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
            Alert.alert("Error", "Failed to delete the staff activity.");
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
        {item.activityName}
      </Text>
      <Text style={styles.tableCell} numberOfLines={1}>
        {moment(item.activityDate).format("MM/DD/YYYY")}
      </Text>

      <View style={styles.tableActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
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

      <Text style={styles.roomheading}>Staff Activities</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            formik.resetForm();
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("StaffList");
          }}
        >
          <Text style={styles.addButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tableHeading}>Staff Name: {staffName}</Text>
      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Date</Text>
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
                      {formik.values.id > 0
                        ? "Edit Activity"
                        : "Assign New Activity"}
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
                    placeholder="Name"
                    placeholderTextColor="#888"
                    value={formik.values.activityName}
                    onChangeText={formik.handleChange("activityName")}
                  />
                  {formik.touched.activityName &&
                    formik.errors.activityName && (
                      <Text style={styles.errorText}>
                        {formik.errors.activityName}
                      </Text>
                    )}

                  <TouchableOpacity
                    onPress={() => setShowActivityDate(true)}
                    style={styles.dateButton}
                  >
                    <Text>
                      {formik.values.activityDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showActivityDate && (
                    <DateTimePicker
                      value={formik.values.activityDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || new Date();
                        setShowActivityDate(false);
                        formik.setFieldValue("activityDate", currentDate);
                      }}
                    />
                  )}
                  {formik.touched.activityDate &&
                    formik.errors.activityDate && (
                      <Text style={styles.errorText}>
                        {formik.errors.activityDate}
                      </Text>
                    )}
                  <TextInput
                   style={[styles.input, styles.multilineInput]}
                    placeholder="Description"
                    placeholderTextColor="#888"
                    multiline
                    value={formik.values.activityDescription}
                    onChangeText={formik.handleChange("activityDescription")}
                  />
                  {formik.touched.activityDescription && formik.errors.activityDescription && (
                    <Text style={styles.errorText}>
                      {formik.errors.activityDescription}
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
const StaffActivityList = ({ route }) => {
  const { staffId, staffName } = route.params || {};
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
        name="StaffActivityListContent"
        component={StaffActivitiesContent}
        initialParams={{ staffId: staffId, staffName: staffName }}
      />
    </Drawer.Navigator>
  );
};

export default StaffActivityList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  safeArea: {
    flex: 1,
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
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  roomheading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  addButton: {
    marginTop: 30,
    backgroundColor: "#180161",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tableHeading: {
    marginTop: 30,
    fontWeight: "bold",
    // fontSize: 12,
  },
  tableContainer: {
    width: "100%",
    height: "40%",
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
    // fontSize: 12,
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
    fontSize: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  button: {
    padding: 12,
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
  dateButton: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
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
