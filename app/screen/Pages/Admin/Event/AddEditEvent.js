import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback, useRef } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import RichTextEditor from "../../../../components/RichTextEditor";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
const Drawer = createDrawerNavigator();
const addEditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  shortDescription: Yup.string().required("Required"),
  eventDate: Yup.date().required("Required"),
  bookingStartDate: Yup.date().required("Required"),
  bookingEndDate: Yup.date().required("Required"),
  description: Yup.string().required("Required"),
  eventImage: Yup.string().notRequired(),
  startTime: Yup.string().required("Required"),
  endTime: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  adultTicketPrice: Yup.number().min(0, "Must be positive"),
  childTicketPrice: Yup.number().min(0, "Must be positive"),
  maxTicket: Yup.number().min(0, "Must be positive"),
});
const AddEditEvent = ({
  route,
  navigation,
  handleChange,
  values = {},
  touched = {},
  errors = {},
}) => {
  const [photo, setImage] = useState(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEventDate, setShowEventDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [listType, setListType] = useState(null);
  const inputRef = useRef(null);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      await AsyncStorage.setItem("eventFile", JSON.stringify(result.assets[0]));
    }
  };
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
    shortDescription: "",
    eventDate: new Date(),
    bookingStartDate: new Date(),
    bookingEndDate: new Date(),
    description: "",
    eventImage: "",
    startTime: "00:00:00",
    endTime: "00:00:00",
    location: "",
    adultTicketPrice: 0,
    childTicketPrice: 0,
    maxTicket: 0,
  };

  const fetchEventData = useCallback(
    async (formikSetValues, setFieldValue) => {
      if (id > 0) {
        try {
          const token = await AsyncStorage.getItem("token");

          const response = await axios.get(
            `http://majidalipl-001-site5.gtempurl.com/Event/GetEventById?id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
            response.data.data.eventDate = new Date(
              response.data.data.eventDate
            );
            response.data.data.bookingStartDate = new Date(
              response.data.data.bookingStartDate
            );
            response.data.data.bookingEndDate = new Date(
              response.data.data.bookingEndDate
            );
            response.data.data.childTicketPrice =
              response.data.data.childTicketPrice.toString();
            response.data.data.adultTicketPrice =
              response.data.data.adultTicketPrice.toString();
            response.data.data.maxTicket =
              response.data.data.maxTicket.toString();
            formikSetValues(response.data.data);
            // setFieldValue("adultTicketPrice","67");
          } else {
            Alert.alert("Error", response.data.message);
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Redirect to login page
            navigation.navigate("Login");
          } else {
            Alert.alert("Error", "Failed to fetch event  data");
          }
        }
      }
    },
    [id]
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const token = await AsyncStorage.getItem("token");
        const myPhoto = await AsyncStorage.getItem("eventFile");
        const formData = new FormData();

        if (photo != null) {
          const imageUri = photo.uri.startsWith("file://")
            ? photo.uri
            : "file://" + photo.uri;

          formData.append("eventFile", {
            uri: imageUri,
            type: photo.mimeType || "image/png",
            name: photo.fileName || "image.png",
          });
        }

        // formData.append("eventName", values.eventName || "rimsha");
        Object.keys(values).forEach((key) => {
          if (key.endsWith("Date")) {
            formData.append(key, values[key].toISOString().split("T")[0]);
            //toISOString().split('T')[0];
          } else {
            formData.append(key, values[key]);
          }
        });

        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Event/AddEditEvent",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Alert.alert("Success", "Event saved successfully.", [
            {
              text: "OK",
              onPress: () => navigation.navigate("EventList"),
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
          Alert.alert("Error", "An error occurred while saving the event.");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [navigation, photo]
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
        setFieldTouched,
        isSubmitting,
        setValues,
      }) => {
        useEffect(() => {
          fetchEventData(setValues, setFieldValue);
        }, [fetchEventData, setValues]);

        return (
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuButton}
              >
                <Ionicons name="menu" size={24} color="black" />
              </TouchableOpacity>

              <Text style={styles.roomheading}>Add / Edit Event</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  navigation.navigate("EventList");
                }}
              >
                <Text style={styles.addButtonText}>Back</Text>
              </TouchableOpacity>

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
                </View>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Short Description</Text>
                    <TextInput
                      onChangeText={handleChange("shortDescription")}
                      value={values.shortDescription}
                      style={styles.input}
                      placeholder="Short Description"
                      placeholderTextColor="#555"
                    />
                    {touched.shortDescription && errors.shortDescription && (
                      <Text style={styles.errorText}>
                        {errors.shortDescription}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Booking Start Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowStartDate(true)}
                      style={styles.dateButton}
                    >
                      <Text>
                        {values.bookingStartDate.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                    {showStartDate && (
                      <DateTimePicker
                        value={values.bookingStartDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowStartDate(false);
                          setFieldValue("bookingStartDate", currentDate);
                        }}
                      />
                    )}
                    {touched.bookingStartDate && errors.bookingStartDate && (
                      <Text style={styles.errorText}>
                        {errors.bookingStartDate}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Booking End Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowEndDate(true)}
                      style={styles.dateButton}
                    >
                      <Text>{values.bookingEndDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showEndDate && (
                      <DateTimePicker
                        value={values.bookingEndDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowEndDate(false);
                          setFieldValue("bookingEndDate", currentDate);
                        }}
                      />
                    )}
                    {touched.bookingEndDate && errors.bookingEndDate && (
                      <Text style={styles.errorText}>
                        {errors.bookingEndDate}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Event Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowEventDate(true)}
                      style={styles.dateButton}
                    >
                      <Text>{values.eventDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showEventDate && (
                      <DateTimePicker
                        value={values.eventDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowEventDate(false);
                          setFieldValue("eventDate", currentDate);
                        }}
                      />
                    )}
                    {touched.eventDate && errors.eventDate && (
                      <Text style={styles.errorText}>{errors.eventDate}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainerTime}>
                    <Text style={styles.heading}>Start Time</Text>
                    <TouchableOpacity
                      onPress={() => setShowStartTime(true)}
                      style={styles.dateButton}
                    >
                      <Text>
                        {timeStringToDate(
                          values.startTime
                        ).toLocaleTimeString()}
                      </Text>
                    </TouchableOpacity>
                    {showStartTime && (
                      <DateTimePicker
                        value={timeStringToDate(values.startTime)}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowStartTime(false);
                          setFieldValue(
                            "startTime",
                            formatTimeSpan(currentDate)
                          ); // Pass the formatted time string
                        }}
                      />
                    )}
                    {touched.startTime && errors.startTime && (
                      <Text style={styles.errorText}>{errors.startTime}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainerTime}>
                    <Text style={styles.heading}>End Time</Text>
                    <TouchableOpacity
                      onPress={() => setShowEndTime(true)}
                      style={styles.dateButton}
                    >
                      <Text>
                        {timeStringToDate(values.endTime).toLocaleTimeString()}
                      </Text>
                    </TouchableOpacity>
                    {showEndTime && (
                      <DateTimePicker
                        value={timeStringToDate(values.endTime)}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowEndTime(false);
                          setFieldValue("endTime", formatTimeSpan(currentDate));
                        }}
                      />
                    )}
                    {touched.endTime && errors.endTime && (
                      <Text style={styles.errorText}>{errors.endTime}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.fullWidthContainer}>
                  <Text style={styles.heading}>Location</Text>
                  <TextInput
                    onChangeText={handleChange("location")}
                    value={values.location}
                    style={styles.input}
                    placeholder="Location"
                    placeholderTextColor="#999"
                  />
                  {touched.location && errors.location && (
                    <Text style={styles.errorText}>{errors.location}</Text>
                  )}
                </View>

                <View style={styles.fullWidthContainer}>
                  <Text style={styles.heading}>Description</Text>
                  <RichTextEditor
                    initialValue={values.description}
                    onChange={(content) => {
                      setFieldValue("description", content);
                      setFieldTouched("description", true);
                    }}
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Adult Ticket Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      onChangeText={handleChange("adultTicketPrice")}
                      value={values.adultTicketPrice}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    {touched.adultTicketPrice && errors.adultTicketPrice && (
                      <Text style={styles.errorText}>
                        {errors.adultTicketPrice}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Child Ticket Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      onChangeText={handleChange("childTicketPrice")}
                      value={values.childTicketPrice}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    {touched.childTicketPrice && errors.childTicketPrice && (
                      <Text style={styles.errorText}>
                        {errors.childTicketPrice}
                      </Text>
                    )}
                  </View>
                  <View style={styles.maxinputContainer}>
                    <Text style={styles.heading}>Max Tickets</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      onChangeText={handleChange("maxTicket")}
                      value={values.maxTicket}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    {touched.maxTicket && errors.maxTicket && (
                      <Text style={styles.errorText}>{errors.maxTicket}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>Upload Image</Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={pickImage}
                    >
                      <Text style={styles.uploadButtonText}>Choose File</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    {photo && photo.uri && (
                      <Image
                        source={{ uri: photo.uri }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#999",
                        }}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    {values.eventImage && values.eventImage != "" && (
                      <>
                        <Text style={styles.heading}>Previous Image</Text>
                        <Image
                          source={{
                            uri:
                              "http://majidalipl-001-site5.gtempurl.com/eventimages/" +
                              values.eventImage,
                          }}
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#999",
                          }}
                        />
                      </>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>SAVE</Text>
                  )}
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
    padding: 20,
    backgroundColor: "white",
  },
  scrollViewContent: {
    // padding: 5,
  },
  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  roomheading: {
    marginTop: 15,
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
    top: 20,
    left: 20,
    zIndex: 1,
  },
  heading: {
    marginBottom: 5,
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputContainerTime: {
    // width: "20%",
    // justifyContent: "space-between",
    flex: 1,
    marginRight: 10,
    // paddingHorizontal: 15,
  },
  maxinputContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 15,
  },
  bookinginputContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 15,
  },
  fullWidthContainer: {
    width: "100%",
    marginBottom: 15,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#180161",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
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

const AddEditEventContent = ({ route }) => {
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
        name="AddEditEventContent"
        component={AddEditEvent}
        initialParams={{ id: id }}
      />
    </Drawer.Navigator>
  );
};

export default AddEditEventContent;
