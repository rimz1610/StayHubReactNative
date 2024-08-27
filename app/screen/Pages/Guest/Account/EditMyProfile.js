import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const EditMyProfile = () => {
  const [imageUri, setImageUri] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileImage} />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={100}
                  color="grey"
                />
              )}
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="#180161" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.row}>
          <View style={styles.inputContainerHalf}>
            <Ionicons name="person-outline" size={20} color="gray" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"grey"}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Ionicons name="person-outline" size={20} color="gray" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"grey"}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={"grey"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="gray" />
          <TextInput
            style={styles.input}
            placeholderTextColor={"grey"}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainerHalf}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"grey"}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"grey"}
              placeholder="State"
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainerHalf}>
            <Ionicons name="location-outline" size={20} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              placeholderTextColor={"grey"}
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainerHalf}>
            <Ionicons name="call-outline" size={20} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={"grey"}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.updateButton}>
          <Ionicons name="checkmark-outline" size={20} color="white" />
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditMyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    backgroundColor: "gray",
    position: "absolute",
    bottom: 0,
    right: 0,
    // backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainerHalf: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#180161",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
