import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const RoomCard = ({ roomNumber, title, image, onPress, navigation }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={image} style={styles.image} />
    <View style={styles.cardContent}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomNumber}>Room {roomNumber}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate("RoomServiceBooking")}
      >
        <Text style={styles.viewButtonText}>Services</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const MyRooms = () => {
  const navigation = useNavigation();

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

  const handleRoomPress = (room) => {
    navigation.navigate("RoomServiceBooking", { room });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Select Your Room</Text>
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          roomNumber={room.roomNumber}
          title={room.title}
          image={room.image}
          onPress={() => handleRoomPress(room)}
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
