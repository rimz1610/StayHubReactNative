import React, { useState, useEffect, useCallback } from "react";
import {
  View,Alert,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const ChangePassword = ({ navigation }) => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleOldPasswordVisibility = () => {
    setIsOldPasswordVisible(!isOldPasswordVisible);
  };
  

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const initialValues = {
    id: 0,
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
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
          Alert.alert("Success", "Password changed successfully. Please login again.", [
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
      touched,
      setFieldValue,
      isSubmitting,
      setValues,
    }) => {
      useEffect(() => {}, []);

      return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.innerContainer}>
            <Text style={styles.heading}>Create New Password</Text>
            <Text style={styles.description}>
              Please create a new password that meets the following criteria:
            </Text>
            <Text style={styles.rules}>
              • At least 8 characters long{"\n"}• Contains uppercase and
              lowercase letters{"\n"}• Includes numbers and symbols
            </Text>

           
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={handleChange("currentPassword")}
                  onBlur={handleBlur("currentPassword")}
                  value={values.currentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!isOldPasswordVisible}
                />
                <TouchableOpacity
                  onPress={toggleOldPasswordVisibility}
                  style={styles.eyeIconContainer}
                >
                  <Ionicons
                    name={isNewPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
              {touched.currentPassword && errors.currentPassword && (
                    <Text style={styles.errorText}>
                      {errors.currentPassword}
                    </Text>
                  )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter new password"
                  placeholderTextColor="#ccc"
                  onChangeText={handleChange("newPassword")}
                  value={values.newPassword}
                  secureTextEntry={!isNewPasswordVisible}
                />
                <TouchableOpacity
                  onPress={toggleNewPasswordVisibility}
                  style={styles.eyeIconContainer}
                >
                  <Ionicons
                    name={isNewPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
              {touched.newPassword && errors.newPassword ? (
                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                  ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#ccc"
                  onChangeText={handleChange("repeatPassword")}
                  value={values.repeatPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity
                  onPress={toggleConfirmPasswordVisibility}
                  style={styles.eyeIconContainer}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
              {touched.repeatPassword && errors.repeatPassword ? (
                    <Text style={styles.errorText}>
                      {errors.repeatPassword}
                    </Text>
                  ) : null}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Change Password</Text>
            </TouchableOpacity>

          
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
      );
    }}
  </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8", // Solid background color
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  rules: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#333",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    color: "#333",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    color: "#333",
    paddingHorizontal: 15,
  },
  eyeIconContainer: {
    paddingHorizontal: 15,
  },
  submitButton: {
    width: "100%",
    height: 50,
    marginTop: 20,
    backgroundColor: "#0A1D56",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default ChangePassword;
