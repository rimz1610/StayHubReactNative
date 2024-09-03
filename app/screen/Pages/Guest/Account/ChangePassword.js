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
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChangePassword = ({ navigation }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require("../../../../../assets/images/back.jpg")}
        style={styles.bg}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the code"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />

            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor="#ccc"
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
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                placeholderTextColor="#ccc"
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
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.backToLogin}>Back to Login?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
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
});

export default ChangePassword;
