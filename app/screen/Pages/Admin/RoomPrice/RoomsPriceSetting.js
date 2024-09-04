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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import MultiSelect from "react-native-multiple-select";
import DrawerContent from "../../../../components/DrawerContent"; // Adjust the path as necessary
import { useIsFocused } from "@react-navigation/native";
import { Formik, useFormik } from "formik";
import { Calendar } from "react-native-calendars";
import * as Yup from "yup";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const initialData = Array.from({ length: 25 }, (_, index) => ({
  id: index.toString(),
  date: `2024-08-${index + 1}`, // Dummy date
  day: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ][index % 7],
  roomName: `Room ${(index % 3) + 1}`, // Dummy room names
  price: `$${(index + 1) * 10}`,
  addPricePerPerson: `$${(index + 1) * 2}`,
  bookingAvailable: index % 2 === 0 ? "Yes" : "No",
}));
const addEditSchema = Yup.object().shape({
  status: Yup.string().required("Required"),
  rooms: Yup.array().min(1, "At least select one"),
  dateRange: Yup.object().shape({
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
  }),
  days: Yup.array().min(1, "At least select one"),
  price: Yup.number().min(0, "Must be positive"),
  addPersonPrice: Yup.number().min(0, "Must be positive"),
});
const Drawer = createDrawerNavigator();

const RoomPriceSettingContent = ({ navigation }) => {
  const [submitting, setSubmitting] = useState(false);
  const [roomlist, setRoomList] = useState([]);
  const priceInputRef = React.useRef(null);
  const personPriceInputRef = React.useRef(null);
  // const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  // const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const formik = useFormik({
    initialValues: {
      price: 0,
      status: "",
      addPersonPrice: 0,
      rooms: [],
      days: [],
      dateRange: {
        startDate: null,
        endDate: null,
      },
    },
    validationSchema: addEditSchema,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Room/SaveBulkRoomPrice",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Alert.alert("Success", "Prices saved successfully.", [
            {
              text: "OK",
              onPress: () => {
                resetForm();
                fetchRoomDD();
              },
            },
          ]);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while saving the enteries.");
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isFocused) {
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

  const renderItem = ({ item }) => <></>;

  // Re-focus the input if necessary
  const handlePriceChange = (text) => {
    formik.setFieldValue("price", text);
    if (priceInputRef.current) {
      priceInputRef.current.focus();
    }
  };

  const handlePersonPriceChange = (text) => {
    formik.setFieldValue("addPersonPrice", text);
    if (personPriceInputRef.current) {
      personPriceInputRef.current.focus();
    }
  };

  const daysOfWeek = [
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
    { id: "Saturday", name: "Saturday" },
    { id: "Sunday", name: "Sunday" },
  ];
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
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#180161" />
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.roomheading}>Rooms Price Settings</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("RoomsPriceDetails")}
        style={styles.backbtn}
      >
        <Text style={styles.backbtnText}>Back</Text>
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
          <Text style={styles.label}>Day of Week </Text>
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
      <View style={styles.priceContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            ref={priceInputRef}
            placeholder="Price"
            placeholderTextColor="#888"
            onEndEditing={handlePriceChange}
            value={formik.values.price}
            style={styles.priceInput}
            keyboardType="numeric"
          />
          {formik.touched.price && formik.errors.price && (
            <Text style={styles.errorText}>{formik.errors.price}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price per Person</Text>
          <TextInput
            ref={personPriceInputRef}
            placeholder="Price per Person"
            placeholderTextColor={"#888"}
            onEndEditing={handlePersonPriceChange}
            value={formik.values.addPersonPrice}
            style={styles.priceInput}
            keyboardType="numeric"
          />
          {formik.touched.addPersonPrice && formik.errors.addPersonPrice && (
            <Text style={styles.errorText}>{formik.errors.addPersonPrice}</Text>
          )}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status</Text>
          <RNPickerSelect
            onValueChange={(value) => formik.setFieldValue("status", value)}
            value={formik.values.status}
            items={[
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={formik.handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={roomlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={null}
        contentContainerStyle={styles.scrollViewContent}
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
    </KeyboardAvoidingView>
  );
};

const RoomPriceSetting = () => {
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
        component={RoomPriceSettingContent}
      />
    </Drawer.Navigator>
  );
};
export default RoomPriceSetting;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  scrollViewContent: {
    padding: 20,
  },
  menuButton: {
    marginBottom: 20,
  },
  roomheading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#180161",
  },
  backbtn: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#180161",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  backbtnText: {
    color: "white",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  calendarContainer: {
    marginBottom: 20,
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  labeldate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    marginLeft: 30,
  },
  datePickerTouchable: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  datePicker: {
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "transparent",
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
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
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    // backgroundColor: '#180161',
    color: "black",
    padding: 12,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    textAlign: "center",
    // color: 'white',
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
    textAlign: "center",
    color: "#444",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#180161",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
    padding: 8,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    backgroundColor: "white",
  },
  inputAndroid: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    backgroundColor: "white",
  },
});
