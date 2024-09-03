import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ResetPassword = ({ navigation }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Required")
      .min(6, "Password too short")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
        "1 Upper, Lowercase, 1 Number and 1 Special Character"
      ),
    confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    code: Yup.string().required("Required"),
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const formik = useFormik({
    initialValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      axios
        .post(
          "http://majidalipl-001-site5.gtempurl.com/Account/ResetPassword",
          values
        )
        .then(function (response) {
          if (response.data.success) {
            setSubmitting(false);
            Alert.alert("Success", response.data.message, [
              {
                text: "OK",
                onPress: () => navigation.navigate("Login"),
              },
            ]);
          } else {
            setSubmitting(false);
            Alert.alert("Request failed", response.data.message, [
              { text: "OK" },
            ]);
          }
        })
        .catch(function (error) {
          console.log(error);
          setSubmitting(false);
          Alert.alert("Request Failed", "Please try again later.", [
            { text: "OK" },
          ]);
        });
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require("../../../../assets/images/back.jpg")}
        style={styles.bg}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.heading}>Reset Password</Text>

            <Text style={styles.label}>Code</Text>
            <TextInput
              style={styles.input}
              onChangeText={formik.handleChange("code")}
              value={formik.values.code}
              placeholder="Enter the code"
              placeholderTextColor="#ccc"
            />
            {formik.touched.code && formik.errors.code ? (
              <Text style={styles.errorText}>{formik.errors.code}</Text>
            ) : null}
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor="#ccc"
                onChangeText={formik.handleChange("newPassword")}
                value={formik.values.newPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIconContainer}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <Text style={styles.errorText}>{formik.errors.newPassword}</Text>
            ) : null}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                placeholderTextColor="#ccc"
                onChangeText={formik.handleChange("confirmPassword")}
                value={formik.values.confirmPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIconContainer}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <Text style={styles.errorText}>
                {formik.errors.confirmPassword}
              </Text>
            ) : null}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.backToLogin}>Back to Login?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              disabled={submitting}
              onPress={formik.handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
  },
  label: {
    alignSelf: "flex-start",
    color: "white",
    marginLeft: 25,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    width: "85%",
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderColor: "grey",
    borderWidth: 1,
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: "white",
    paddingHorizontal: 10,
  },
  eyeIconContainer: {
    paddingHorizontal: 10,
  },
  backToLogin: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginBottom: 30,
  },
  submitButton: {
    width: "60%",
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
    alignItems: "start",
    marginBottom: 1,
  },
});

export default ResetPassword;
