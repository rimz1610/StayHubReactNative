import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const EditProfileSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  zipcode: Yup.string().required("Required"),
  imgPath: Yup.string().notRequired(),
});
const EditMyProfile = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [photo, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setImageUri(result.assets[0].uri);
    }
  };

  const initialValues = {
    id: 0,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    address: "",
    phoneNumber: "",
    zipcode: "",
    imgPath: "",
  };

  const fetchProfileData = useCallback(
    async (formikSetValues, setFieldValue) => {
      try {
        const guestId = await AsyncStorage.getItem("loginId");
        const response = await axios.get(
          `http://majidalipl-001-site5.gtempurl.com/Guest/GetProfile?guestId=${guestId}`
        );
        if (response.data.success) {
          formikSetValues(response.data.data);
          if (
            response.data.data.imgPath != "" &&
            response.data.data.imgPath != "null" &&
            response.data.data.imgPath != null &&
            response.data.data.imgPath != undefined
          ) {
            setImageUri(
              `http://majidalipl-001-site5.gtempurl.com/guestprofile/${response.data.data.imgPath}`
            );
            setImage(null);
          }
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch profile");
      }
    },
    [navigation]
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const formData = new FormData();

        if (photo) {
          formData.append("guestProfile", {
            uri:
              Platform.OS === "android"
                ? photo.uri
                : photo.uri.replace("file://", ""),
            type: photo.mimeType || "image/jpeg",
            name: photo.fileName || `profile_${Date.now()}.jpg`,
          });
        }

        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Guest/EditProfile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          await AsyncStorage.setItem("email", values.email);
          await AsyncStorage.setItem(
            "name",
            `${values.firstName} ${values.lastName}`
          );
          await AsyncStorage.setItem("profile", response.data.data);
          Alert.alert("Success", "Profile updated successfully.");
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while updating the profile.");
      } finally {
        setSubmitting(false);
      }
    },
    [navigation, photo]
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EditProfileSchema}
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
          fetchProfileData(setValues, setFieldValue);
        }, [fetchProfileData, setValues]);
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.imageWrapper}>
                <TouchableOpacity onPress={pickImage}>
                  <View style={styles.imageContainer}>
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={100}
                        color="grey"
                      />
                    )}
                    <TouchableOpacity
                      style={styles.cameraIcon}
                      onPress={pickImage}
                    >
                      <Ionicons name="camera" size={24} color="#180161" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>Edit Profile</Text>

              <View style={styles.row}>
                <View style={styles.inputContainerHalf}>
                  <Ionicons name="person-outline" size={20} color="gray" />
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("firstName")}
                    value={values.firstName}
                    placeholderTextColor={"grey"}
                    placeholder="First Name"
                  />
                  {touched.firstName && errors.firstName ? (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  ) : null}
                </View>
                <View style={styles.inputContainerHalf}>
                  <Ionicons name="person-outline" size={20} color="gray" />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={"grey"}
                    placeholder="Last Name"
                    onChangeText={handleChange("lastName")}
                    value={values.lastName}
                  />
                  {touched.lastName && errors.lastName ? (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="gray" />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor={"grey"}
                  onChangeText={handleChange("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="gray" />
                <TextInput
                  style={styles.input}
                  placeholderTextColor={"grey"}
                  placeholder="Address"
                  onChangeText={handleChange("address")}
                  value={values.address}
                />
                {touched.address && errors.address ? (
                  <Text style={styles.errorText}>{errors.address}</Text>
                ) : null}
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainerHalf}>
                  <Ionicons name="location-outline" size={20} color="gray" />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={"grey"}
                    placeholder="City"
                    onChangeText={handleChange("city")}
                    value={values.city}
                  />
                  {touched.city && errors.city ? (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  ) : null}
                </View>
                <View style={styles.inputContainerHalf}>
                  <Ionicons name="location-outline" size={20} color="gray" />
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={"grey"}
                    placeholder="State"
                    onChangeText={handleChange("state")}
                    value={values.state}
                  />
                  {touched.state && errors.state ? (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainerHalf}>
                  <Ionicons name="location-outline" size={20} color="gray" />
                  <TextInput
                    style={styles.input}
                    placeholder="Zip Code"
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    onChangeText={handleChange("zipcode")}
                    value={values.zipcode}
                  />
                  {touched.zipcode && errors.zipcode ? (
                    <Text style={styles.errorText}>{errors.zipcode}</Text>
                  ) : null}
                </View>
                <View style={styles.inputContainerHalf}>
                  <Ionicons name="call-outline" size={20} color="gray" />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor={"grey"}
                    keyboardType="phone-pad"
                    onChangeText={handleChange("phoneNumber")}
                    value={values.phoneNumber}
                  />
                  {touched.phoneNumber && errors.phoneNumber ? (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                disabled={isSubmitting}
                onPress={handleSubmit}
              >
                <Ionicons name="checkmark-outline" size={20} color="white" />
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
};

export default EditMyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    backgroundColor: "gray",
    position: "absolute",
    bottom: 0,
    right: 0,
    // backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainerHalf: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#180161",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
