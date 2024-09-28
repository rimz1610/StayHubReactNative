import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ForgotPassword = ({ navigation }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "admin@gmail.com",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      axios
        .post(
          "http://majidalipl-001-site5.gtempurl.com/Account/ForgotPassword",
          values
        )
        .then(function (response) {
          if (response.data.success) {
            setSubmitting(false);
            Alert.alert("Success", response.data.message, [
              {
                text: "OK",
                onPress: () => navigation.navigate("ResetPassword"),
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
        <View style={styles.childContainer}>
          <Text style={styles.heading}>Forgot Password?</Text>
          <Text style={styles.label}>
            "Enter your registered email below, and we’ll send you instructions
            to reset it."
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="#0A1D56"
                style={styles.inputIcon}
              />
              <TextInput
                name="email"
                placeholder="Please Enter Your Email"
                placeholderTextColor="#999"
                onChangeText={formik.handleChange("email")}
                value={formik.values.email}
                keyboardType="email-address"
                style={styles.input}
              />
              {formik.touched.email && formik.errors.email ? (
                <Text style={styles.errorText}>{formik.errors.email}</Text>
              ) : null}
            </View>
          </View>
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
    marginTop: 50,
    alignSelf: "flex-start",
  },
  label: {
    color: "#999",
    marginBottom: 30,
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
  eyeIcon: {
    padding: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  backToLogin: {
    color: "#0A1D56",
    textAlign: "left",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#0A1D56",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default ForgotPassword;
