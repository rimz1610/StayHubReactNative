import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useFormik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import axios from "axios";

const Signup = ({ navigation }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const SignUpSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    zipcode: Yup.string().required("Required"),
  });
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      city: "",
      state: "",
      address: "",
      phoneNumber: "",
      zipcode: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      axios
        .post("http://majidalipl-001-site5.gtempurl.com/Guest/Register", values)
        .then(function (response) {
          if (response.data.success) {
            setSubmitting(false);
            Alert.alert(
              "Success",
              "Account created successfully. Please login",
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.navigate("Login");
                  },
                },
              ]
            );
          } else {
            setSubmitting(false);
            Alert.alert("Register Failed", response.data.message, [
              { text: "OK" },
            ]);
          }
        })
        .catch(function (error) {
          console.warn(error);
          setSubmitting(false);
        });
    },
  });
  const InputField = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
  }) => (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={24}
        color="#0A1D56"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* <View contentContainerStyle={styles.scrollViewContent}> */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="arrow-back" size={28} color="#0A1D56" />
        </TouchableOpacity>
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.signupText}>Sign up</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={24}
              color="#0A1D56"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={formik.values.firstName}
              onChangeText={formik.handleChange("firstName")}
            />
          </View>
          {formik.touched.firstName && formik.errors.firstName && (
            <Text style={styles.errorText}>{formik.errors.firstName}</Text>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={24}
              color="#0A1D56"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={formik.values.lastName}
              onChangeText={formik.handleChange("lastName")}
            />
          </View>
          {formik.touched.lastName && formik.errors.lastName && (
            <Text style={styles.errorText}>{formik.errors.lastName}</Text>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#0A1D56"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
            />
          </View>
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.errorText}>{formik.errors.email}</Text>
          )}

          <View style={styles.passwordContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#0A1D56"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
              />
            </View>
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#0A1D56"
              />
            </TouchableOpacity>
          </View>
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="home-outline"
              size={24}
              color="#0A1D56"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#999"
              value={formik.values.address}
              onChangeText={formik.handleChange("address")}
            />
          </View>
          {formik.touched.address && formik.errors.address && (
            <Text style={styles.errorText}>{formik.errors.address}</Text>
          )}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color="#0A1D56"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#999"
                  value={formik.values.city}
                  onChangeText={formik.handleChange("city")}
                />
              </View>
              {formik.touched.city && formik.errors.city && (
                <Text style={styles.errorText}>{formik.errors.city}</Text>
              )}
            </View>

            <View style={styles.halfWidth}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="map-outline"
                  size={24}
                  color="#0A1D56"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#999"
                  value={formik.values.state}
                  onChangeText={formik.handleChange("state")}
                />
              </View>
              {formik.touched.state && formik.errors.state && (
                <Text style={styles.errorText}>{formik.errors.state}</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color="#0A1D56"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Zip Code"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={formik.values.zipcode}
                  onChangeText={formik.handleChange("zipcode")}
                />
              </View>
              {formik.touched.zipcode && formik.errors.zipcode && (
                <Text style={styles.errorText}>{formik.errors.zipcode}</Text>
              )}
            </View>

            <View style={styles.halfWidth}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={24}
                  color="#0A1D56"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={formik.values.phoneNumber}
                  onChangeText={formik.handleChange("phoneNumber")}
                />
              </View>
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <Text style={styles.errorText}>
                  {formik.errors.phoneNumber}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            disabled={submitting}
            onPress={() => navigation.navigate("RoomBooking")}
          >
            <Text style={styles.submitText}>Register</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>
            Already have an account?{" "}
            <Text style={styles.loginLinkHighlight}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backIcon: {
    top: 20,
    left: 10,
    position: "absolute",
    zIndex: 1,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    alignSelf: "center",
    // marginBottom: 10,
  },
  signupText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A1D56",
    // marginBottom: 20,
    alignSelf: "flex-start",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    marginVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#0A1D56",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    top: 18,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  submitButton: {
    backgroundColor: "#0A1D56",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#0A1D56",
  },
  loginLinkHighlight: {
    color: "#0A1D56",
    fontWeight: "bold",
    // color: "#007bff",
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: -15,
    marginBottom: 10,
  },
});

export default Signup;
