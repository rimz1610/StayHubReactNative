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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback, useRef } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();
const addEditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  fee: Yup.number().min(1, "Greater than zero"),
  capacity: Yup.number().min(1, "Greater than zero"),
  rules: Yup.string().notRequired(),
  equipment: Yup.string().required("Required"),
  openingTime: Yup.string().required("Required"),
  closingTime: Yup.string().required("Required"),
});
const AddEditGymContent = ({
  route,
  navigation,
  handleChange,
  values = {},
  touched = {},
  errors = {},
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [listType, setListType] = useState(null);
  const inputRef = useRef(null);
  const [showOpeningTime, setShowOpeningTime] = useState(false);
  const [showClosingTime, setShowClosingTime] = useState(false);
  const formatTimeSpan = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  // Function to convert "HH:mm:ss" string to a Date object
  const timeStringToDate = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

  const id = route.params?.id || 0;
  const initialValues = {
    id: 0,
    name: "",
    gender: "",
    description: "",
    fee: 0,
    capacity: "1",
    rules: "",
    equipment: "",
    openingTime: "00:00:00",
    closingTime: "00:00:00",
  };

  const fetchGymData = useCallback(
    async (formikSetValues, setFieldValue) => {
      if (id > 0) {
       
        try {
          const token = await AsyncStorage.getItem("token");

          const response = await axios.get(
            `http://majidalipl-001-site5.gtempurl.com/Gym/GetGymById?id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
           
            response.data.data.fee = response.data.data.fee.toString();
            response.data.data.capacity =
              response.data.data.capacity.toString();
            formikSetValues(response.data.data);

          } else {
            Alert.alert("Error", response.data.message);
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Redirect to login page
            navigation.navigate('Login');
          }
          else{
          Alert.alert("Error", "Failed to fetch gym data");}
        }
      }
    },
    [id]
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        console.warn(values);
        values.fee = Number(values.fee);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Gym/AddEditGym",
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          Alert.alert("Success", "Gym saved successfully.", [
            {
              text: "OK",
              onPress: () => navigation.navigate("GymList"),
            },
          ]);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate('Login');
        }
        else{
        console.warn(error);
        Alert.alert("Error", "An error occurred while saving the gym.");}
      } finally {
        setSubmitting(false);
      }
    },
    [navigation]
  );

  const handleTextChange = (text) => {
    if (handleChange && typeof handleChange === "function") {
      handleChange("description")(text);
    }
  };

  const getTextStyle = () => ({
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    textAlign: textAlign,
  });

  const applyListFormat = (type) => {
    setListType(listType === type ? null : type);
    const currentText = values.description || "";
    if (typeof currentText !== "string") {
      console.warn("Description is not a string:", currentText);
      return;
    }
    const lines = currentText.split("\n");
    const lastLine = lines[lines.length - 1];

    if (listType === type) {
      // Remove list formatting
      lines[lines.length - 1] = lastLine.replace(/^[•\d]+\.\s/, "");
    } else {
      // Add list formatting
      const prefix = type === "bullet" ? "• " : `${lines.length}. `;
      lines[lines.length - 1] = lastLine ? `${prefix}${lastLine}` : prefix;
    }

    handleTextChange(lines.join("\n"));
    inputRef.current?.focus();
  };

  const addParagraph = () => {
    const currentText = values.description || "";
    if (typeof currentText !== "string") {
      console.warn("Description is not a string:", currentText);
      return;
    }
    handleTextChange(currentText + "\n\n");
    inputRef.current?.focus();
  };

  const renderToolbarButton = (icon, action, isActive, style = {}) => (
    <TouchableOpacity
      onPress={action}
      style={[styles.toolbarButton, isActive && styles.activeButton]}
    >
      <Feather
        name={icon}
        size={20}
        color={isActive ? "#ffffff" : "#333333"}
        style={style}
      />
    </TouchableOpacity>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addEditSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
        setValues,
      }) => {
        useEffect(() => {
          fetchGymData(setValues, setFieldValue);
        }, [fetchGymData, setValues]);

        return (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.menuButton}
            >
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.roomheading}>Add / Edit Gym</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                navigation.navigate("GymList");
              }}
            >
              <Text style={styles.addButtonText}>Back</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.formContainer}>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Name</Text>
                    <TextInput
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor="#999"
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Gender</Text>
                    <RNPickerSelect
                      onValueChange={(value) => setFieldValue("gender", value)}
                      value={values.gender}
                      items={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                      style={pickerSelectStyles}
                      placeholder={{ label: "Select Gender", value: null }}
                    />
                    {touched.gender && errors.gender && (
                      <Text style={styles.errorText}>{errors.gender}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Fee</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      onChangeText={handleChange("fee")}
                      value={values.fee}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    {touched.fee && errors.fee && (
                      <Text style={styles.errorText}>{errors.fee}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Capacity</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      onChangeText={handleChange("capacity")}
                      value={values.capacity}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    {touched.capacity && errors.capacity && (
                      <Text style={styles.errorText}>{errors.capacity}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Opening Time</Text>
                    <TouchableOpacity
                      onPress={() => setShowOpeningTime(true)}
                      style={styles.dateButton}
                    >
                      <Text>
                        {timeStringToDate(
                          values.openingTime
                        ).toLocaleTimeString()}
                      </Text>
                    </TouchableOpacity>
                    {showOpeningTime && (
                      <DateTimePicker
                        value={timeStringToDate(values.openingTime)}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowOpeningTime(false);
                          setFieldValue(
                            "openingTime",
                            formatTimeSpan(currentDate)
                          );
                        }}
                      />
                    )}
                    {touched.openingTime && errors.openingTime && (
                      <Text style={styles.errorText}>{errors.openingTime}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Closing Time</Text>
                    <TouchableOpacity
                      onPress={() => setShowClosingTime(true)}
                      style={styles.dateButton}
                    >
                      <Text>
                        {timeStringToDate(
                          values.closingTime
                        ).toLocaleTimeString()}
                      </Text>
                    </TouchableOpacity>
                    {showClosingTime && (
                      <DateTimePicker
                        value={timeStringToDate(values.closingTime)}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowClosingTime(false);
                          setFieldValue(
                            "closingTime",
                            formatTimeSpan(currentDate)
                          );
                        }}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.fullWidthContainer}>
                  <Text style={styles.heading}>Rules</Text>
                  <TextInput
                    onChangeText={handleChange("rules")}
                    value={values.rules}
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Rules"
                    placeholderTextColor="#999"
                    multiline
                  />
                  {touched.rules && errors.rules && (
                    <Text style={styles.errorText}>{errors.rules}</Text>
                  )}
                </View>
                <View style={styles.fullWidthContainer}>
                  <Text style={styles.heading}>Equipment</Text>
                  <TextInput
                    onChangeText={handleChange("equipment")}
                    value={values.equipment}
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Equipment"
                    placeholderTextColor="#999"
                    multiline
                  />
                  {touched.equipment && errors.equipment && (
                    <Text style={styles.errorText}>{errors.equipment}</Text>
                  )}
                </View>

                <View style={styles.fullWidthContainer}>
                  <Text style={styles.dlabel}>Description</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.toolbar}
                  >
                    {renderToolbarButton(
                      "bold",
                      () => setIsBold(!isBold),
                      isBold
                    )}
                    {renderToolbarButton(
                      "italic",
                      () => setIsItalic(!isItalic),
                      isItalic
                    )}
                    {renderToolbarButton(
                      "align-left",
                      () => setTextAlign("left"),
                      textAlign === "left"
                    )}
                    {renderToolbarButton(
                      "align-center",
                      () => setTextAlign("center"),
                      textAlign === "center"
                    )}
                    {renderToolbarButton(
                      "align-right",
                      () => setTextAlign("right"),
                      textAlign === "right"
                    )}
                    {renderToolbarButton(
                      "list",
                      () => applyListFormat("bullet"),
                      listType === "bullet"
                    )}
                    {renderToolbarButton(
                      "list",
                      () => applyListFormat("numbered"),
                      listType === "numbered",
                      { transform: [{ rotate: "90deg" }] }
                    )}
                    {renderToolbarButton("type", addParagraph)}
                  </ScrollView>
                  <TextInput
                    ref={inputRef}
                    onChangeText={handleChange("description")}
                    value={
                      typeof values.description === "string"
                        ? values.description
                        : ""
                    }
                    style={[styles.dinput, styles.dtextArea, getTextStyle()]}
                    placeholder="Description"
                    placeholderTextColor="#999"
                    multiline
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                >
                  <Text style={styles.saveButtonText}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 20,
  },
  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
    marginRight: 20,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  roomheading: {
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  formContainer: {
    width: "100%",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  heading: {
    marginBottom: 5,
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "white",
  },
  fullWidthContainer: {
    width: "100%",
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#180161",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "70%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dlabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
  },
  toolbar: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 5,
  },
  toolbarButton: {
    padding: 8,
    marginRight: 5,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  dinput: {
    borderWidth: 1,
    // borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  dtextArea: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "white",
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: "white",
  },
});

const AddEditGym = ({ route }) => {
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
        name="AddEditGymContent"
        component={AddEditGymContent}
        initialParams={{ id: id }}
      />
    </Drawer.Navigator>
  );
};

export default AddEditGym;
