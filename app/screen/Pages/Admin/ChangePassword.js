import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../../../components/DrawerContent"; // Adjust the path as needed

const Drawer = createDrawerNavigator();

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string()
    .required("Required")
    .min(6, "Password too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      "1 Upper, Lowercase, 1 Number and 1 Special Character"
    ),
  repeatPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

const AdminChangePasswordContent = ({ navigation }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const initialValues = {
    id: 0,
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        values.id = Number(await AsyncStorage.getItem("loginId"));

        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Account/ChangePassword",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          Alert.alert("Success", "Password changed successfully.", [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("expiry");
                await AsyncStorage.removeItem("generated");
                await AsyncStorage.removeItem("role");
                await AsyncStorage.removeItem("email");
                await AsyncStorage.removeItem("name");
                await AsyncStorage.removeItem("loginId");
                navigation.navigate("Login");
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
          console.warn(error);
          Alert.alert("Error", "An error occurred while changing password.");
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
      validationSchema={passwordSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        resetForm,
        touched,
        setFieldValue,
        isSubmitting,
        setValues,
      }) => {
        useEffect(() => {}, []);

        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={styles.menuButton}
              >
                <Ionicons name="menu" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../../../assets/images/logo.png")}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.heading}>Change Password</Text>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  {/* <Text style={styles.label}>Current Password</Text> */}
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#0A1D56"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    onChangeText={handleChange("currentPassword")}
                    onBlur={handleBlur("currentPassword")}
                    value={values.currentPassword}
                    style={styles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="#180161"
                    />
                  </TouchableOpacity>
                </View>
                {touched.currentPassword && errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
                <View style={styles.inputContainer}>
                  {/* <Text style={styles.label}>New Password</Text> */}
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#0A1D56"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#999"
                    onChangeText={handleChange("newPassword")}
                    value={values.newPassword}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="#180161"
                    />
                  </TouchableOpacity>
                  {touched.newPassword && errors.newPassword ? (
                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                  ) : null}
                </View>
                <View style={styles.inputContainer}>
                  {/* <Text style={styles.label}>Repeat Password</Text> */}
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#0A1D56"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#999"
                    onChangeText={handleChange("repeatPassword")}
                    value={values.repeatPassword}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={isPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="#180161"
                    />
                  </TouchableOpacity>
                  {touched.repeatPassword && errors.repeatPassword ? (
                    <Text style={styles.errorText}>
                      {errors.repeatPassword}
                    </Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                disabled={isSubmitting}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>SAVE</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
};
const AdminChangePassword = ({ navigation }) => {
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
        name="AdminChangePasswordC"
        component={AdminChangePasswordContent}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    height: "30%",
    marginTop: -30,
  },
  logo: {
    width: 270,
    height: 270,
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A1D56",
    marginBottom: 20,
    marginTop: 60,
    alignSelf: "flex-start",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0A1D56",
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#0A1D56",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    // marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10, // Adjust this value based on your design to vertically center the icon
  },
  inputIcon: {
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#0A1D56",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default AdminChangePassword;
