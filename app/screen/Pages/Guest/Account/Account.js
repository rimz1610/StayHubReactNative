import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";


const Account = ({ navigation }) => {
  const isFocused = useIsFocused();
  const LOADING_TIMEOUT = 10000;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [data, setData] = useState({ guestNo: "", name: "", email: "", profile: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageLoading) {
        setImageError(true);
        setImageLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => clearTimeout(timer);
  }, [imageLoading]);
  useEffect(() => {
    if (isFocused) {
      handleAccountLoggedIn();
    }
  }, [isFocused]);


  const handleAccountLoggedIn = async () => {
    try {
      if (await AsyncStorage.getItem("loginId") == null) {
        navigation.navigate("Login");
      }
      else {
        setData({
          guestNo: await AsyncStorage.getItem("guestNo"),
          name: await AsyncStorage.getItem("name"),
          email: await AsyncStorage.getItem("email"),
          profile: await AsyncStorage.getItem("profile")
        })
      }

    } catch (error) {
      // console.warn(error);
    }
  };

  const [coverImageLoaded, setCoverImageLoaded] = useState(false);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);

  const screens = [
    { name: "My Bookings", icon: "calendar", route: "MyBookings" },
    { name: "Edit My Profile", icon: "person", route: "EditMyProfile" },
    { name: "My Rooms", icon: "bed", route: "MyRooms" },
    { name: "Change Password", icon: "lock-closed", route: "ChangePassword" },
  ];

  const handleLogout = async () => {
    try {
      const keysToRemove = [
        "token",
        "expiry",
        "generated",
        "role",
        "email",
        "name",
        "loginId",
        "profile",
        "guestNo"
      ];
      await AsyncStorage.multiRemove(keysToRemove);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.coverImageContainer}>
          <Image
            source={require("../../../../../assets/images/placeholder.jpg")}
            style={[
              styles.coverImage,
              !coverImageLoaded && styles.imagePlaceholder,
            ]}
          />
          <Image
            source={require("../../../../../assets/images/room-two.jpg")}
            style={[
              styles.coverImage,
              coverImageLoaded ? styles.imageLoaded : styles.imageHidden,
            ]}
            onLoad={() => setCoverImageLoaded(true)}
          />
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../../../../assets/images/placeholder.jpg")}
              style={[
                styles.profileImage,
                !profileImageLoaded && styles.imagePlaceholder,
              ]}
            />
            <Image
              source={require("../../../../../assets/images/room-one.jpg")}
              style={[
                styles.profileImage,
                profileImageLoaded ? styles.imageLoaded : styles.imageHidden,
              ]}
              onLoad={() => setProfileImageLoaded(true)}
            />
          </View>
          <Text style={styles.name}>Fatima Zuhra</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.email}>{data.email}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {screens.map((screen, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => navigation.navigate(screen.route)}
            >
              <Ionicons name={screen.icon} size={24} color="#333" />
              <Text style={styles.optionText}>{screen.name}</Text>
              <Ionicons name="chevron-forward" size={24} color="#333" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  coverImageContainer: {
    height: 200,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    height: "90%",
    resizeMode: "cover",
    position: "absolute",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "white",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  imagePlaceholder: {
    backgroundColor: "#e0e0e0",
  },
  imageLoaded: {
    opacity: 1,
  },
  imageHidden: {
    opacity: 0,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  emailContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 5,
  },
  email: {
    fontSize: 16,
    color: "#333",
  },
  optionsContainer: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    marginHorizontal: 20,
    width: "50%",
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  hiddenImage: {
    opacity: 0,
  },
  logoutText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default Account;
