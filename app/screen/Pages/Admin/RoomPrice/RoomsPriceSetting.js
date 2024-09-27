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
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import MultiSelect from "react-native-multiple-select";
import DrawerContent from "../../../../components/DrawerContent"; // Adjust the path as necessary
import { useIsFocused } from "@react-navigation/native";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
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
  startDate: Yup.date().required("Required"),
  endDate: Yup.date().required("Required"),
  days: Yup.array().min(1, "At least select one"),
  price: Yup.number().min(0, "Must be positive"),
  addPersonPrice: Yup.number().min(0, "Must be positive"),
});
const Drawer = createDrawerNavigator();
const RoomPriceSettingContent = ({ navigation }) => {
  const [submitting, setSubmitting] = useState(false);
  const [roomlist, setRoomList] = useState([]);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const isFocused = useIsFocused();
  const formik = useFormik({
    initialValues: {
      price: 0,
      status: "",
      addPersonPrice: 0,
      rooms: [],
      days: [],
      startDate: new Date(),
      endDate: new Date(),
    },
    validationSchema: addEditSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
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
              },
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
          Alert.alert("Error", "An error occurred while saving the enteries.");
        }
      } finally {
        setSubmitting(false);
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
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        navigation.navigate("Login");
      } else {
        console.warn(error);
        Alert.alert("Error", "Failed to fetch rooms.");
      }
    } finally {
    }
  };
  const renderItem = ({ item }) => <></>;
  const daysOfWeek = [
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
    { id: "Saturday", name: "Saturday" },
    { id: "Sunday", name: "Sunday" },
  ];
  const renderHeader = () => (
    <>
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
        <View style={styles.inputContainerDate}>
          <Text style={styles.heading}>Start Date</Text>
          {Platform.OS === "android" && (
            <>
              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.dateButton}
              >
                <Text>{formik.values.startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showFromDatePicker && (
                <DateTimePicker
                  value={formik.values.startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowFromDatePicker(false);
                    const currentDate = selectedDate || new Date();
                    formik.setFieldValue("startDate", currentDate);
                  }}
                />
              )}
            </>
          )}
          {Platform.OS === "ios" && (
            <DateTimePicker
              value={formik.values.startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || new Date();
                formik.setFieldValue("startDate", currentDate);
              }}
              style={styles.datePicker}
            />
          )}
          {formik.touched.startDate && formik.errors.startDate && (
            <Text style={styles.errorText}>{formik.errors.startDate}</Text>
          )}
        </View>
        <View style={styles.inputContainerDate}>
          <Text style={styles.heading}>End Date</Text>
          {Platform.OS === "android" && (
            <>
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={styles.dateButton}
              >
                <Text>{formik.values.endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showToDatePicker && (
                <DateTimePicker
                  value={formik.values.endDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowToDatePicker(false);
                    const currentDate = selectedDate || new Date();
                    formik.setFieldValue("endDate", currentDate);
                  }}
                />
              )}
            </>
          )}
          {Platform.OS === "ios" && (
            <DateTimePicker
              value={formik.values.endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || new Date();
                formik.setFieldValue("endDate", currentDate);
              }}
              style={styles.datePicker}
            />
          )}
          {formik.touched.endDate && formik.errors.endDate && (
            <Text style={styles.errorText}>{formik.errors.endDate}</Text>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.priceContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              placeholder="Price"
              placeholderTextColor={"#888"}
              onChangeText={formik.handleChange("price")}
              onBlur={formik.handleBlur("price")}
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
              placeholder="Price per Person"
              placeholderTextColor={"#888"}
              onChangeText={formik.handleChange("addPersonPrice")}
              onBlur={formik.handleBlur("addPersonPrice")}
              value={formik.values.addPersonPrice}
              style={styles.priceInput}
              keyboardType="numeric"
            />
            {formik.touched.addPersonPrice && formik.errors.addPersonPrice && (
              <Text style={styles.errorText}>
                {formik.errors.addPersonPrice}
              </Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={roomlist}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={null}
        contentContainerStyle={styles.scrollViewContent}
      />
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
    backgroundColor: "white",
  },

  scrollViewContent: {
    padding: 20,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
  roomheading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 15,
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
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 20,
  // },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputContainerDate: {
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
  },
  datePicker: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 7,
    borderColor: "#ccc",
    borderWidth: 2,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 12, // Ensure consistent padding
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
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
