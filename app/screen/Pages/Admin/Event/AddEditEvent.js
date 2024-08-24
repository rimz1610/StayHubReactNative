import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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
  startTime: Yup.object().required("Required"),
  endTime: Yup.object().required("Required"),
  location: Yup.string().required("Required"),
  adultTicketPrice: Yup.number().min(0, "Must be positive"),
  childTicketPrice: Yup.number().min(0, "Must be positive"),
  maxTicket: Yup.number().min(0, "Must be positive"),
});
const AddEditEvent = ({ route, navigation }) => {
  const [photo, setImage] = useState(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEventDate, setShowEventDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

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
    }
  };
  // const handleChoosePhoto = async () => {
  //     // No permissions request is necessary for launching the image library
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     console.log(result);

  //     if (!result.canceled) {
  //       setImage(result.assets[0]);
  //     }
  //   };
  // const handleChoosePhoto4 = () => {
  //     console.warn("clicked")
  // const options = {
  //   noData: true,
  // }
  // ImagePicker.launchImageLibrary(options, response => {
  //   if (response.uri) {
  //     setPhoto(response);
  //   }
  // })
  //   }

  const id = route.params?.id || 0;
  const initialValues = {
    id: 0,
    name: "",
    shortDescription: "",
    eventDate: new Date(),
    bookingStartDate: new Date(),
    bookingEndDate: new Date(),
    description: "",
    eventImage: Yup.string().notRequired(),
    startTime: new Date(),
    endTime: new Date(),
    location: "",
    adultTicketPrice: 0,
    childTicketPrice: 0,
    maxTicket: 0,
  };

  const fetchEventData = useCallback(
    async (formikSetValues) => {
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
            formikSetValues(response.data.data);
          } else {
            Alert.alert("Error", response.data.message);
          }
        } catch (error) {
          Alert.alert("Error", "Failed to fetch room data");
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
        const formData = new FormData();

        formData.append("eventFile", {
          name: photo.fileName,
          type: photo.type,
          uri:
            Platform.OS === "android"
              ? photo.uri
              : photo.uri.replace("file://", ""),
        });
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
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
        Alert.alert("Error", "An error occurred while saving the event.");
      } finally {
        setSubmitting(false);
      }
    },
    [navigation]
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
          fetchEventData(setValues);
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
                    <Text style={styles.heading}>BOOKING START DATE</Text>
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
                  <View style={styles.bookinginputContainer}>
                    <Text style={styles.heading}>BOOKING END DATE</Text>
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
                    <Text style={styles.heading}>EVENT DATE</Text>
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
                    {touched.bookingEndDate && errors.bookingEndDate && (
                      <Text style={styles.errorText}>
                        {errors.bookingEndDate}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>START TIME</Text>
                    <TouchableOpacity
                      onPress={() => setShowStartTime(true)}
                      style={styles.dateButton}
                    >
                      <Text>{values.startTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showStartTime && (
                      <DateTimePicker
                        value={values.startTime}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowStartTime(false);
                          setFieldValue("startTime", currentDate);
                        }}
                      />
                    )}
                    {touched.bookingEndDate && errors.bookingEndDate && (
                      <Text style={styles.errorText}>
                        {errors.bookingEndDate}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>END TIME</Text>
                    <TouchableOpacity
                      onPress={() => setShowEndTime(true)}
                      style={styles.dateButton}
                    >
                      <Text>{values.endTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showEndTime && (
                      <DateTimePicker
                        value={values.endTime}
                        mode="time"
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowEndTime(false);
                          setFieldValue("endTime", currentDate);
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
                <View style={styles.fullWidthContainer}>
                  <Text style={styles.heading}>LOCATION</Text>
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
                  <TextInput
                    onChangeText={handleChange("description")}
                    value={values.description}
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Description"
                    placeholderTextColor="#999"
                    multiline
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.heading}>ADULT TICKET PRICE</Text>
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
                    <Text style={styles.heading}>CHILD TICKET PRICE</Text>
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
                    <Text style={styles.heading}>MAX TICKETS</Text>
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
                    <TouchableOpacity style={styles.uploadButton}>
                      <Text style={styles.uploadButtonText} onPress={pickImage}>
                        Choose File
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    {photo && (
                      <>
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
                      </>
                    )}
                  </View>
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
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 10,
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
        name="AddEditEvent"
        component={AddEditEvent}
        initialParams={{ id: id }}
      />
    </Drawer.Navigator>
  );
};

export default AddEditEventContent;
