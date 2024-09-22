import React, { useState, useEffect } from "react";
import {
  View,Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const RoomCard = ({ roomId, checkInDate,checkOutDate, title, image, navigation }) => (
  <View style={styles.card}>
    <Image source={{uri:image}} style={styles.image} />
    <View style={styles.cardContent}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomNumber}>Room (
          {moment(checkInDate).format("MMM DD YYYY")} - {moment(checkOutDate).format("MMM DD YYYY")})</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() =>
          navigation.navigate("RoomServiceBooking", { roomId: roomId, roomName:title})
        }
      >
        <Text style={styles.viewButtonText}>Services</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const MyRooms = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [myRooms,setMyRooms]=useState([]);
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  // Function to refetch the updated room list
  const fetchData = async () => {
   
      const token = await AsyncStorage.getItem("token");
      const loginId  = await AsyncStorage.getItem("loginId");
      console.warn(loginId);
      setLoading(true);
      try {
        const response = await axios.get(
          "http://majidalipl-001-site5.gtempurl.com/Booking/GetCurrentRoomsByGuestId?guestId=" +
           loginId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      
        if (response.data.success) {
          setMyRooms(response.data.list);
          console.warn(response.data);
        } else {

          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate("Login");
        } else {
          console.warn(error);
          Alert.alert("Error", "Failed to fetch your rooms.");
        }
      } finally {
        setLoading(false);
      }
    
  };


  const rooms = [
    {
      id: 1,
      roomNumber: "101",
      title: "Luxury Suite",
      image: require("../../../../../assets/images/room-one.jpg"),
    },
    {
      id: 2,
      roomNumber: "201",
      title: "Deluxe Room",
      image: require("../../../../../assets/images/room-two.jpg"),
    },
    {
      id: 3,
      roomNumber: "301",
      title: "Standard Room",
      image: require("../../../../../assets/images/room-three.jpg"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Select Your Room</Text>
      {myRooms!=null && myRooms.map((room) => (
        <RoomCard
          roomId={room.roomId}
          key={room.roomId}
          checkInDate={room.checkInDate}
          checkOutDate={room.checkOutDate}
          title={room.roomName}
          image={room.roomImage}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#2c3e50",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  roomInfo: {
    marginBottom: 12,
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#180161",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  viewButton: {
    backgroundColor: "#180161",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default MyRooms;
