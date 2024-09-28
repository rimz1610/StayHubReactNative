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
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="arrow-back" size={28} color="#0A1D56" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.heading}>Reset Password</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Code</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="verified-user"
              size={24}
              color="black"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              onChangeText={formik.handleChange("code")}
              value={formik.values.code}
              placeholder="Enter the code"
              placeholderTextColor="#999"
            />

            {formik.touched.code && formik.errors.code ? (
              <Text style={styles.errorText}>{formik.errors.code}</Text>
            ) : null}
          </View>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
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
              onChangeText={formik.handleChange("newPassword")}
              value={formik.values.newPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#0A1D56"
              />
            </TouchableOpacity>
          </View>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <Text style={styles.errorText}>{formik.errors.newPassword}</Text>
          ) : null}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#0A1D56"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              onChangeText={formik.handleChange("confirmPassword")}
              value={formik.values.confirmPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#0A1D56"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  backIcon: {
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
  formContainer: {
    width: "100%",
  },
  childContainer: {
    marginTop: 80,
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
    marginBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A1D56",
    marginBottom: 10,
    marginTop: 60,
    alignSelf: "flex-start",
  },
  label: {
    alignSelf: "flex-start",
    color: "white",
    marginLeft: 25,
    fontSize: 13,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0A1D56",
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#0A1D56",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  backToLogin: {
    color: "#0A1D56",
    textAlign: "left",
    marginTop: 10,
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#0A1D56",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
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
