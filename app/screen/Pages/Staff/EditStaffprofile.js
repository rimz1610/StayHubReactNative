import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StaffDrawer from "../../../components/StaffDrawer";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const editProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(25, "Too long")
    .required("First name is required"),
  lastName: Yup.string().max(25, "Too long").required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const InputField = ({ label, error, touched, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, touched && error && styles.inputError]}
      placeholderTextColor="#888"
      {...props}
    />
    {touched && error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const EditStaffProfileContent = ({ navigation }) => {
  const initialValues = {
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  const fetchProfileData = useCallback(async (formikSetValues) => {
    try {
      const staffId = await AsyncStorage.getItem("loginId");
      const response = await axios.get(
        `http://majidalipl-001-site5.gtempurl.com/Staff/GetById?id=${staffId}`
      );
      if (response.data.success) {
        formikSetValues(response.data.data);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "Failed to fetch profile");
    }
  }, []);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    try {
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
        await AsyncStorage.setItem("email", values.email);
        await AsyncStorage.setItem(
          "name",
          `${values.firstName} ${values.lastName}`
        );
        Alert.alert("Success", "Profile updated successfully.");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the profile.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={editProfileSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
          setValues,
        }) => {
          useEffect(() => {
            fetchProfileData(setValues);
          }, [fetchProfileData, setValues]);

          return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => navigation.openDrawer()}
                  style={styles.menuButton}
                >
                  <Ionicons name="menu" size={24} color="#180161" />
                </TouchableOpacity>
                <Text style={styles.heading}>Edit Profile</Text>
              </View>

              <View style={styles.formContainer}>
                <InputField
                  label="First Name"
                  placeholder="Enter your first name"
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={errors.firstName}
                  touched={touched.firstName}
                />

                <InputField
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={errors.lastName}
                  touched={touched.lastName}
                />

                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                />

                <InputField
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={values.phoneNumber}
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                  keyboardType="phone-pad"
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const EditStaff = () => (
  <Drawer.Navigator
    drawerContent={(props) => <StaffDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: "60%",
      },
    }}
  >
    <Drawer.Screen
      name="EditStaffProfileContent"
      component={EditStaffProfileContent}
    />
  </Drawer.Navigator>
);

export default EditStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  menuButton: {
    padding: 5,
  },
  heading: {
    flex: 1,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginLeft: -29, // Offset for the menu button
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#180161",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#180161",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
