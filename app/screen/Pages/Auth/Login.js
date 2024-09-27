import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { deleteCartFromSecureStore } from "../../../components/secureStore";
const Login = ({ navigation }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const isFocused = useIsFocused();
  const SetToken = async (loginModel) => {
    const expireTime = Date.now() + 300000;
    await AsyncStorage.setItem("expireTime", expireTime.toString());
    await AsyncStorage.setItem("token", loginModel.token);
    await AsyncStorage.setItem("expiry", loginModel.expiry.toString());
    await AsyncStorage.setItem("role", loginModel.role);
    await AsyncStorage.setItem("email", loginModel.email);
    await AsyncStorage.setItem("name", loginModel.name);
    await AsyncStorage.setItem("loginId", loginModel.id);
    await AsyncStorage.setItem("profile", loginModel.profile);
    await AsyncStorage.setItem("guestNo", loginModel.guestNo);
    await AsyncStorage.setItem("generated", new Date().toISOString());
    var role = loginModel.role;
    if (role === "ADMIN") {
      navigation.navigate("Dashboard");
    } else if (role === "GUEST") {
      navigation.navigate("GuestBottomNav");
    } else if (role === "STAFF") {
      navigation.navigate("StaffTasks");
    }
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const SigninSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SigninSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      axios
        .post("http://majidalipl-001-site5.gtempurl.com/Account/Login", values)
        .then(function (response) {
          if (response.data.success) {
            SetToken(response.data.data);
            setSubmitting(false);
          } else {
            setSubmitting(false);
            Alert.alert("Login Failed", "Invalid email or password", [
              { text: "OK" },
            ]);
          }
        })
        .catch(function (error) {
          console.log(error);
          setSubmitting(false);
          Alert.alert("Login Failed", "Invalid email or password", [
            { text: "OK" },
          ]);
        });
    },
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("expiry");
    await AsyncStorage.removeItem("generated");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("loginId");
    await AsyncStorage.removeItem("profile");
    await AsyncStorage.removeItem("guestNo");

    //Temporary deleting store
    // await deleteCartFromSecureStore();
  };
  useEffect(() => {
    if (isFocused) {
      handleLogout();
      formik.resetForm();
    }
  }, [isFocused]);
  // const ScreenWrapper = ({ children }) => (
  //   <View style={{ flex: 1, backgroundColor: "black" }}>{children}</View>
  // );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.skipButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("RoomBooking")}
            // onPress={RoomBooking}
            activeOpacity={0.7}
          >
            <Text style={styles.text}>Skip</Text>
            <Feather
              name="arrow-right"
              size={20}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.loginText}>Login</Text>
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
              placeholder="Email"
              placeholderTextColor="#999"
              onChangeText={formik.handleChange("email")}
              value={formik.values.email}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#0A1D56"
              style={styles.inputIcon}
            />
            <TextInput
              name="password"
              placeholder="Password"
              placeholderTextColor="#999"
              onChangeText={formik.handleChange("password")}
              value={formik.values.password}
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
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
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            disabled={submitting}
            onPress={formik.handleSubmit}
          >
            <Text style={styles.submitText}>
              {submitting ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>
            New to StayHub? <Text style={styles.signupLink}>Sign up</Text>
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
    padding: 20,
  },
  skipButton: {
    alignSelf: "flex-end",
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
    marginBottom: 10,
  },
  loginText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A1D56",
    marginBottom: 30,
    marginTop: 30,
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
    marginBottom: 20,
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
  forgotPasswordText: {
    color: "#0A1D56",
    textAlign: "right",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#0A1D56",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    color: "#999",
    marginVertical: 20,
  },
  signupBtn: {
    top: 55,
    alignItems: "center",
  },
  signupLink: {
    color: "#0A1D56",
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 70,
  },
  skipButton: {
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A1D56",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  icon: {
    marginLeft: 4,
  },
});

export default Login;
