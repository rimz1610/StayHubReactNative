import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
// import { Feather } from "@expo/vector-icons";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { Formik } from "formik";
import * as Yup from "yup";
import RichTextEditor from "../../../../components/RichTextEditor";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../../../../components/DrawerContent"; // Adjust the path as needed
import { ROOM_TYPES } from "../../../constant";
const Drawer = createDrawerNavigator();

const addEditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  type: Yup.string().required("Required"),
  shortDescription: Yup.string().required("Required"),
  maxAdditionalPerson: Yup.number().min(0).required("Required"),
  description: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  imagesUrl: Yup.array().of(
    Yup.object().shape({
      roomId: Yup.number().notRequired(),
      id: Yup.number().required("Required"),
      imageUrl: Yup.string().required("Required"),
      sortOrder: Yup.number(0, "Must be positive").required("Required"),
    })
  ),
});

const AddEditRoom = ({
  route,
  navigation,
  handleChange,
  values = {},
  touched = {},
  errors = {},
}) => {
  // Ref for RichEditor
  // const [isBold, setIsBold] = useState(false);
  // const [isItalic, setIsItalic] = useState(false);
  // const [textAlign, setTextAlign] = useState("left");
  // const [listType, setListType] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const richEditorRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const id = route.params?.id || 0;
  const initialValues = {
    id: 0,
    type: "Single",
    name: "",
    shortDescription: "",
    maxAdditionalPerson: 0,
    description: "",
    status: "",
    price: 0,
    imagesUrl: [
      {
        id: 0,
        roomId: 0,
        imageUrl: "",
        sortOrder: 1,
      },
    ],
  };

  const fetchRoomData = useCallback(
    async (formikSetValues) => {
      if (id > 0) {
        try {
          const token = await AsyncStorage.getItem("token");

          const response = await axios.get(
            `http://majidalipl-001-site5.gtempurl.com/Room/GetRoomById?id=${id}`,
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
          if (error.response && error.response.status === 401) {
            // Redirect to login page
            navigation.navigate("Login");
          } else {
            Alert.alert("Error", "Failed to fetch room data");
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
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Room/SaveRoom",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Alert.alert("Success", "Room saved successfully.", [
            {
              text: "OK",
              onPress: () => navigation.navigate("RoomList"),
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
          Alert.alert("Error", "An error occurred while saving the room.");
        }
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
        setFieldTouched,
        isSubmitting,
        setValues,
      }) => {
        useEffect(() => {
          fetchRoomData(setValues);
        }, [fetchRoomData, setValues]);

        const addImageField = () => {
          const newImage = {
            id: 0,
            roomId: 0,
            imageUrl: "",
            sortOrder: values.imagesUrl.length + 1,
          };
          setFieldValue("imagesUrl", [...values.imagesUrl, newImage]);
        };

        const removeImageField = (index) => {
          const newImages = values.imagesUrl.filter((_, i) => i !== index);
          setFieldValue("imagesUrl", newImages);
        };

        return (
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.menuButton}
            >
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.roomheading}>Add / Edit Room</Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("RoomList")}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.formContainer}>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#555"
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Room Type</Text>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue("type", value)}
                    value={values.type}
                    items={ROOM_TYPES}
                    style={pickerSelectStyles}
                  />
                  {touched.type && errors.type && (
                    <Text style={styles.errorText}>{errors.type}</Text>
                  )}
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Max Additional Person</Text>
                  <TextInput
                    onChangeText={handleChange("maxAdditionalPerson")}
                    value={values.maxAdditionalPerson.toString()}
                    style={styles.input}
                    placeholder="Max Additional Person"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Status</Text>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue("status", value)}
                    value={values.status}
                    items={[
                      { label: "Active", value: "A" },
                      { label: "Inactive", value: "I" },
                    ]}
                    style={pickerSelectStyles}
                  />
                  {touched.status && errors.status && (
                    <Text style={styles.errorText}>{errors.status}</Text>
                  )}
                </View>
              </View>

              <View style={styles.singleRow}>
                <Text style={styles.label}>Short Description</Text>
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
              <Text style={styles.label}>Description</Text>
              <RichTextEditor
                initialValue={values.description}
                onChange={(content) => {
                  setFieldValue("description", content);
                  setFieldTouched("description", true);
                }}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addImageField}
              >
                <Text style={styles.addButtonText}>+ Add Images</Text>
              </TouchableOpacity>

              {values.imagesUrl.map((image, index) => (
                <View key={index} style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Image Url</Text>
                    <TextInput
                      value={image.imageUrl}
                      onChangeText={(url) => {
                        const newImages = [...values.imagesUrl];
                        newImages[index].imageUrl = url;
                        setFieldValue("imagesUrl", newImages);
                      }}
                      required={false}
                      style={styles.input}
                      placeholder="Image URL"
                      placeholderTextColor="#555"
                      onBlur={() =>
                        setFieldTouched(`imagesUrl.${index}.imageUrl`, true)
                      }
                    />
                    {touched.imagesUrl &&
                      touched.imagesUrl[index]?.imageUrl &&
                      errors.imagesUrl &&
                      errors.imagesUrl[index]?.imageUrl && (
                        <Text style={styles.errorText}>
                          {errors.imagesUrl[index].imageUrl}
                        </Text>
                      )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Sort Order</Text>
                    <TextInput
                      value={image.sortOrder.toString()}
                      onChangeText={(sortOrder) => {
                        const newImages = [...values.imagesUrl];

                        if (Number.isInteger(parseInt(sortOrder))) {
                          const isUnique = !newImages.some(
                            (image, idx) =>
                              image.sortOrder === parseInt(sortOrder) &&
                              idx !== index
                          );

                          if (isUnique) {
                            newImages[index].sortOrder = parseInt(sortOrder);
                            setFieldValue("imagesUrl", newImages);
                          } else {
                            Alert.alert("Error", "Sort order must be unique.");
                          }
                        } else {
                          newImages[index].sortOrder = 0;
                        }

                        setFieldValue("imagesUrl", newImages);
                      }}
                      style={styles.input}
                      placeholder="Sort Order"
                      placeholderTextColor="#555"
                      keyboardType="numeric"
                    />
                    {errors.imagesUrl && errors.imagesUrl[index]?.sortOrder && (
                      <Text style={styles.errorText}>
                        {errors.imagesUrl[index].sortOrder}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => removeImageField(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}

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
        );
      }}
    </Formik>
  );
};
const AddEditRoomContent = ({ route }) => {
  const { id } = route.params || {}; // Get the passed id parameter
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
        name="Add/EditRooms"
        component={AddEditRoom}
        initialParams={{ id: id }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  menuButton: {
    position: "absolute",
    top: 34,
    left: 20,
    zIndex: 1,
  },
  editorContainer: {
    marginHorizontal: 10,
    minHeight: 200,
    maxHeight: 400,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  toolbar: {
    backgroundColor: "#f7f7f7",
  },
  editor: {
    flex: 1,
    // padding: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  roomheading: {
    marginTop: 32,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  singleRow: {
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#180161",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
  },
  addButton: {
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    alignSelf: "flex-end",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#180161",
    padding: 15,
    width: "70%",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 18,
  },
  // errorText: {
  //   fontSize: 12,
  //   color: "red",
  // },

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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
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
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "#555",
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "#555",
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: "#fff",
  },
});

export default AddEditRoomContent;
