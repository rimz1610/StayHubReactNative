import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import MultiSelect from "react-native-multiple-select";
import { useIsFocused } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  date: `2024-08-${index + 1}`,
  day: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ][index % 7],
  roomName: `Room ${(index % 3) + 1}`,
  price: `$${(index + 1) * 10}`,
  addPricePerPerson: `$${(index + 1) * 2}`,
  bookingAvailable: index % 2 === 0 ? "Yes" : "No",
}));
const filterSchema = Yup.object().shape({
  status: Yup.string().required("Required"),
  rooms: Yup.array().min(1, "At least select one"),
  dateRange: Yup.object().shape({
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
  }),
  days: Yup.array().min(1, "At least select one"),
});
const editSchema = Yup.object().shape({
  status: Yup.string().required("Required"),
  price: Yup.number().min(0, "Must be positive"),
  addPersonPrice: Yup.number().min(0, "Must be positive"),
});

const Drawer = createDrawerNavigator();

const RoomPriceAvailabilityDetailsContent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomlist, setRoomList] = useState([]);
  // const [dateRange, setDateRange] = useState({});
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const isFocused = useIsFocused();

  const itemsPerPage = 5;

  const formik = useFormik({
    initialValues: {
      status: "L",
      rooms: [],
      days: [],
      dateRange: {
        startDate: null,
        endDate: null,
      },
    },
    validationSchema: filterSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Room/GetRoomsAvailabilityPrice",
          {
            ...values,
            startDate: values.dateRange.startDate,
            endDate: values.dateRange.endDate,
          },
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
        Alert.alert("Error", "An error occurred while fetching data.");
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const editformik = useFormik({
    initialValues: {
      id: 0,
      price: 0,
      status: "",
      addPersonPrice: 0,
    },
    validationSchema: editSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Room/UpdateSinglePrice",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Alert.alert("Success", "Changes saved successfully.", [
            {
              text: "OK",
              onPress: () => formik.handleSubmit(),
            },
          ]);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching data.");
      } finally {
        setSubmitting(false);
        resetForm();
        setModalVisible(false);
      }
    },
  });

  useEffect(() => {
    if (isFocused) {
      formik.resetForm();
      editformik.resetForm();
      setData([]);
      fetchRoomDD();
    }
  }, [isFocused]);

  // Function to refetch the updated room list
  const fetchRoomDD = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Room/GetRoomDD",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setRoomList(response.data.list);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "Failed to fetch rooms.");
    } finally {
    }
  };

  const handleEdit = (item) => {
    const result = {
      id: item.id,
      price: item.price.toString(),
      addPersonPrice: item.addPersonPrice.toString(),
      status: item.status,
    };
    editformik.setValues(result);
    setModalVisible(true);
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
      <Text style={styles.tableCell}>
        {moment(item.date).format("MM/DD/YY")}
      </Text>
      <Text style={styles.tableCell}>{item.days.substring(0, 3)}</Text>
      <Text style={styles.tableCell}>{item.roomName}</Text>
      <Text style={styles.tableCell}>
        {item.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </Text>
      <Text style={styles.tableCell}>
        {item.addPersonPrice.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </Text>
      {/* <Text style={styles.tableCell}>{formatCurrency({amount: item.price, code: "AUD" })}</Text> */}
      <Text style={styles.tableCell}>
        {item.status.trim() == "A"
          ? "Available"
          : item.status.trim() == "B"
          ? "Booked"
          : "Not Available"}
      </Text>
      <View style={styles.tableActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={14} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const daysOfWeek = [
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
    { id: "Saturday", name: "Saturday" },
    { id: "Sunday", name: "Sunday" },
  ];
  const renderEmptyTable = () => (
    <View style={styles.emptyTableContainer}>
      <Text style={styles.emptyTableText}>No rows are added</Text>
    </View>
  );
  const handleDateSelection = (day) => {
    let newRange = {};
    if (
      Object.keys(dateRange).length === 0 ||
      Object.keys(dateRange).length === 2
    ) {
      newRange = {
        [day.dateString]: {
          startingDay: true,
          color: "#180161",
          textColor: "white",
        },
      };
      formik.setFieldValue("dateRange", {
        startDate: day.dateString,
        endDate: null,
      });
    } else {
      const startDate = Object.keys(dateRange)[0];
      if (moment(day.dateString).isSameOrAfter(startDate)) {
        newRange = {
          ...dateRange,
          [startDate]: {
            startingDay: true,
            color: "#180161",
            textColor: "white",
          },
          [day.dateString]: {
            endingDay: true,
            color: "#180161",
            textColor: "white",
          },
        };
        let currentDate = moment(startDate).add(1, "days");
        const endDate = moment(day.dateString);
        while (currentDate.isBefore(endDate)) {
          newRange[currentDate.format("YYYY-MM-DD")] = {
            color: "#180161",
            textColor: "white",
          };
          currentDate = currentDate.add(1, "days");
        }
        formik.setFieldValue("dateRange", {
          startDate: startDate,
          endDate: day.dateString,
        });
        setIsCalendarVisible(false);
      } else {
        newRange = {
          [day.dateString]: {
            startingDay: true,
            color: "#180161",
            textColor: "white",
          },
        };
        formik.setFieldValue("dateRange", {
          startDate: day.dateString,
          endDate: null,
        });
      }
    }
    setDateRange(newRange);
  };

  const renderHeader = () => (
    <>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.roomheading}>Room Price & Availability</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("RoomsPriceSetting");
        }}
      >
        <Text style={styles.addButtonText}>Update Bulk Prices</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.dateRangeContainer}>
          <Text style={styles.heading}>Date Range</Text>
          <TouchableOpacity
            style={styles.dateRangeButton}
            onPress={() => setIsCalendarVisible(true)}
          >
            <Text style={styles.dateRangeButtonText}>
              {formik.values.dateRange.startDate &&
              formik.values.dateRange.endDate
                ? `${moment(formik.values.dateRange.startDate).format(
                    "MMM DD, YYYY"
                  )} - ${moment(formik.values.dateRange.endDate).format(
                    "MMM DD, YYYY"
                  )}`
                : "Select Date Range"}
            </Text>
          </TouchableOpacity>
          {formik.touched.dateRange && formik.errors.dateRange && (
            <Text style={styles.errorText}>
              {formik.errors.dateRange.startDate ||
                formik.errors.dateRange.endDate}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status</Text>
          <RNPickerSelect
            onValueChange={(value) => formik.setFieldValue("status", value)}
            value={formik.values.status}
            items={[
              { label: "All", value: "L" },
              { label: "Booked", value: "B" },
              { label: "Available", value: "A" },
              { label: "Not Available", value: "N" },
            ]}
            style={pickerSelectStyles}
          />
          {formik.touched.status && formik.errors.status && (
            <Text style={styles.errorText}>{formik.errors.status}</Text>
          )}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.multiSelectContainer}>
          <Text style={styles.label}>Rooms</Text>
          <MultiSelect
            items={roomlist}
            uniqueKey="id"
            onSelectedItemsChange={(selectedRooms) => {
              formik.setFieldValue("rooms", selectedRooms); // Save the selected room IDs
            }}
            selectedItems={formik.values.rooms}
            // onSelectedItemsChange={(e)=>{ formik.setFieldValue("rooms", Array.isArray(e) ? e.map(x => x.id) : [])}}
            // selectedItems={rooms.filter(obj => formik.values.rooms.includes(obj.id))}
            selectText="Pick Rooms"
            searchInputPlaceholderText="Search Rooms..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#000"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={styles.searchInputStyle}
            styleInputGroup={styles.multiSelect}
            styleDropdownMenuSubsection={styles.multiSelect}
            styleTextDropdown={styles.selectTextStyle}
            styleTextDropdownSelected={styles.selectTextStyle}
            styleSelectorContainer={styles.multiSelect}
            styleChipContainer={styles.chipContainer}
            styleChipText={styles.chipText}
            submitButtonColor="#180161"
            submitButtonText="Select"
          />
          {formik.touched.rooms && formik.errors.rooms && (
            <Text style={styles.errorText}>{formik.errors.rooms}</Text>
          )}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.multiSelectContainer}>
          <Text style={styles.label}>Day of Week</Text>
          <MultiSelect
            items={daysOfWeek}
            uniqueKey="id"
            onSelectedItemsChange={(selectedDays) => {
              formik.setFieldValue("days", selectedDays); // Save the selected room IDs
            }}
            selectedItems={formik.values.days}
            selectText="Pick Days"
            searchInputPlaceholderText="Search Days..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#000"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: "#CCC" }}
            styleInputGroup={styles.multiSelect}
            styleDropdownMenuSubsection={styles.multiSelect}
            styleTextDropdown={styles.selectTextStyle}
            styleTextDropdownSelected={styles.selectTextStyle}
            styleSelectorContainer={styles.multiSelect}
            styleChipContainer={styles.chipContainer}
            styleChipText={styles.chipText}
            submitButtonColor="#180161"
            submitButtonText="Select"
          />
          {formik.touched.days && formik.errors.days && (
            <Text style={styles.errorText}>{formik.errors.days}</Text>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={formik.handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText} numberOfLines={1}>
          Date
        </Text>
        <Text
          style={styles.tableHeaderText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Day
        </Text>
        <Text
          style={styles.tableHeaderText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Room Name
        </Text>
        <Text
          style={styles.tableHeaderText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Price
        </Text>
        <Text
          style={styles.tableHeaderText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Add Person Price
        </Text>
        <Text style={styles.tableHeaderText} numberOfLines={2}>
          Status
        </Text>
        <Text
          style={styles.tableHeaderText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          <Ionicons name="construct" size={12} color="black" />
        </Text>
      </View>
    </>
  );
  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  const renderFooter = () => (
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
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={data.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={loading ? renderLoader() : renderEmptyTable} // Display loader or empty message
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            flexGrow: 1,
            justifyContent: data.length === 0 ? "center" : "flex-start",
          }, // Adjust based on content
        ]}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date Range</Text>
              <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Calendar
              markingType={"period"}
              markedDates={dateRange}
              onDayPress={handleDateSelection}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#180161",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#180161",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#180161",
                selectedDotColor: "#ffffff",
                arrowColor: "#180161",
                monthTextColor: "#180161",
                indicatorColor: "#180161",
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>
        </View>
      </Modal>
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
                    <Text style={styles.modalTitle}>Update Room Price</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.heading}>Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={editformik.handleChange("price")}
                    value={editformik.values.price}
                  />

                  {editformik.touched.price && editformik.errors.price && (
                    <Text style={styles.errorText}>
                      {editformik.errors.price}
                    </Text>
                  )}
                  <Text style={styles.haeding}>Additional Person Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    onChangeText={editformik.handleChange("addPersonPrice")}
                    value={editformik.values.addPersonPrice}
                  />

                  {editformik.touched.addPersonPrice &&
                    editformik.errors.addPersonPrice && (
                      <Text style={styles.errorText}>
                        {editformik.errors.addPersonPrice}
                      </Text>
                    )}
                  <Text style={styles.heading}>Status</Text>
                  <RNPickerSelect
                    onValueChange={(value) =>
                      editformik.setFieldValue("status", value)
                    }
                    value={editformik.values.status}
                    items={[
                      { label: "Available", value: "A" },
                      { label: "Not Available", value: "N" },
                    ]}
                    style={pickerSelectStyles}
                  />
                  {editformik.touched.status && editformik.errors.status && (
                    <Text style={styles.errorText}>
                      {editformik.errors.status}
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
                      disabled={submitting}
                      onPress={editformik.handleSubmit}
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
    </KeyboardAvoidingView>
  );
};

const RoomPriceAvailabilityDetails = () => {
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
        name="RoomPriceAvailabilityDetailsContent"
        component={RoomPriceAvailabilityDetailsContent}
      />
    </Drawer.Navigator>
  );
};

export default RoomPriceAvailabilityDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 20,
  },
  modalScrollViewContent: {
    padding: 20,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  dateRangeContainer: {
    marginBottom: 20,
  },
  dateRangeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  dateRangeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
  },
  menuButton: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#180161",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  roomheading: {
    color: "#180161",
    width: "80%",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    left: 40,
    marginVertical: 20,
  },
  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#180161",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 0,
    height: 40,
  },
  multiSelectContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  multiSelect: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selectTextStyle: {
    fontSize: 16,
    color: "#888",
    textAlign: "left",
    paddingLeft: 10,
  },
  searchInputStyle: {
    color: "#333",
    fontSize: 16,
  },
  chipContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: {
    color: "#333",
  },
  tableContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 10, // Reduced font size
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    textAlign: "center",
    color: "#444",
  },
  tableActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#007BFF",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  editButtonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    width: 40,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#180161",
  },
  paginationButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageIndicator: {
    fontSize: 16,
    color: "#333",
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
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  emptyTableContainer: {
    flex: 1, // Allows the container to grow and center its content vertically
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  emptyTableText: {
    fontSize: 16,
    color: "#666",
  },
});
