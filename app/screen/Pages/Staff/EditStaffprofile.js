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
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StaffDrawer from "../../../components/StaffDrawer";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
const editProdfileSchema = Yup.object().shape({
  firstName: Yup.string().max(25, "Too long").required("Required"),
  lastName: Yup.string().max(25, "Too long").required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phoneNumber: Yup.string().required("Required"),
});
const Drawer = createDrawerNavigator();
const EditStaffprofileContent = ({ navigation }) => {
  const initialValues = {
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  const fetchProfileData = useCallback(
    async (formikSetValues, setFieldValue) => {
      try {
        const staffId = await AsyncStorage.getItem("loginId");
        console.warn(staffId);
        const response = await axios.get(
          `http://majidalipl-001-site5.gtempurl.com/Staff/GetById?id=${staffId}`
        );
        console.warn(response.data);        
        if (response.data.success) {
          formikSetValues(response.data.data);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        console.warn(error);
        Alert.alert("Error", "Failed to fetch profile");
      }
    },
    [navigation]
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
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
    },
    [navigation]
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editProdfileSchema }
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
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.menuButton}
            >
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.roomheading}>Edit Profile</Text>
            <View style={styles.formContainer}>
             
              <View style={styles.singleRow}>
              <Text style={styles.label}>First Name</Text>
                  
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#888"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                  />

                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>
                      {errors.firstName}
                    </Text>
                  )}
              </View>
              <View style={styles.singleRow}>
               
                <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#888"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                  />

                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>
                      {errors.lastName}
                    </Text>
                  )}
              </View>

              <View style={styles.singleRow}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={values.email}
                  onChangeText={handleChange("email")}
                />

                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View style={styles.singleRow}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#888"
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                  />

                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.errorText}>
                      {errors.phoneNumber}
                    </Text>
                  )}
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
        );
      }}
    </Formik>
  );
};
const EditStaff = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <StaffDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "60%",
        },
      }}
    >
      <Drawer.Screen name="EditStaffprofileContent" component={EditStaffprofileContent} />
    </Drawer.Navigator>
  );
};

export default EditStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  formContainer: {
    width: "100%",
  },
  roomheading: {
    marginTop: 32,
    color: "#180161",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
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
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
  },

});
