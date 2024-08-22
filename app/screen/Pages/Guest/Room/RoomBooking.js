import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import RoomImage from "../../../../../assets/images/room.jpg";
import RoomImage1 from "../../../../../assets/images/room-one.jpg";
import RoomImage2 from "../../../../../assets/images/room-two.jpg";
import RoomImage3 from "../../../../../assets/images/room-three.jpg";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const RoomBooking = () => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [additionalPerson, setAdditionalPerson] = useState(1);
  const [roomType, setRoomType] = useState("Deluxe");

  useEffect(() => {
    calculateNumberOfNights();
  }, [checkInDate, checkOutDate]);

  const calculateNumberOfNights = () => {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nightsDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setNumberOfNights(nightsDiff);
  };

  const onCheckInChange = (event, selectedDate) => {
    const currentDate = selectedDate || checkInDate;
    setShowCheckInPicker(false);
    setCheckInDate(currentDate);
  };

  const onCheckOutChange = (event, selectedDate) => {
    const currentDate = selectedDate || checkOutDate;
    setShowCheckOutPicker(false);
    setCheckOutDate(currentDate);
  };

  const renderRoomItem = (name, type, price, image) => (
    <View style={styles.roomItem}>
      <Image source={image} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{name}</Text>
        <Text style={styles.roomType}>{type}</Text>
        <Text style={styles.roomPrice}>${price}/night</Text>
      </View>
      <TouchableOpacity
        onPress={() => setShowDetails(true)}
        style={styles.viewDetails}
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setShowDetails(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateSection}>
        <Text style={styles.sectionLabel}>Check In & Check Out Date</Text>
        <View style={styles.dateButtonsContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckInPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Check-In Date: {checkInDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckOutPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Check-Out Date: {checkOutDate.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.nightsText}>No of Nights: {numberOfNights}</Text>
      </View>

      {showCheckInPicker && (
        <DateTimePicker
          testID="checkInDatePicker"
          value={checkInDate}
          mode="date"
          display="default"
          onChange={onCheckInChange}
        />
      )}

      {showCheckOutPicker && (
        <DateTimePicker
          testID="checkOutDatePicker"
          value={checkOutDate}
          mode="date"
          display="default"
          onChange={onCheckOutChange}
        />
      )}

      <View style={styles.separator} />

      <View style={styles.filterSection}>
        <View style={styles.optionBar}>
          <Text style={styles.optionLabel}>Additional Person:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={additionalPerson}
              style={styles.picker}
              onValueChange={(itemValue) => setAdditionalPerson(itemValue)}
            >
              {[...Array(10).keys()].map((i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.optionBar}>
          <Text style={styles.optionLabel}>Room Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={roomType}
              style={styles.picker}
              onValueChange={(itemValue) => setRoomType(itemValue)}
            >
              {["Deluxe", "Suite", "Standard"].map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.availableRoomsHeading}>Available Rooms</Text>

      {renderRoomItem("Cozy Suite", "Deluxe", 150, RoomImage)}
      {renderRoomItem("Ocean View", "Suite", 250, RoomImage1)}
      {renderRoomItem("Standard Room", "Standard", 100, RoomImage2)}
      {renderRoomItem("Family Room", "Deluxe", 200, RoomImage3)}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetails}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Room Details</Text>
          <Text style={styles.modalText}>The Standard Room comprises of:</Text>
          <View style={styles.bulletPointContainer}>
            <Text style={styles.bulletPoint}>
              • 1 Double Bed or 2 Twin Beds
            </Text>
            <Text style={styles.bulletPoint}>• 2 Bedside Tables</Text>
            <Text style={styles.bulletPoint}>• A Desk & Chair</Text>
            <Text style={styles.bulletPoint}>• Wall-to-wall carpeting</Text>
            <Text style={styles.bulletPoint}>• Trendy furnishings</Text>
            <Text style={styles.bulletPoint}>• A balcony</Text>
            <Text style={styles.bulletPoint}>
              • Ultramodern glass bathroom equipped with:
            </Text>
            <Text style={styles.bulletSubPoint}>- Hairdryer</Text>
            <Text style={styles.bulletSubPoint}>
              - Magnifying shaving and make-up mirror
            </Text>
            <Text style={styles.bulletSubPoint}>
              - All the amenities you could possibly need during your stay
            </Text>
          </View>

          <View style={styles.imageGrid}>
            {[RoomImage1, RoomImage2, RoomImage3].map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(image)}
                style={styles.imageContainer}
              >
                <Image source={image} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetails(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.fullScreenImageContainer}>
          <Image source={selectedImage} style={styles.fullScreenImage} />
          <TouchableOpacity
            style={styles.closeFullScreenButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  dateSection: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dateButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  dateButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  nightsText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#180161",
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginBottom: 15,
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  optionBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 10,
  },
  pickerContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    width: 120,
  },
  picker: {
    height: 40,
  },
  filterButton: {
    backgroundColor: "#180161",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  availableRoomsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  roomItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  roomImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  roomInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roomType: {
    fontSize: 14,
    color: "#666",
  },
  roomPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#180161",
  },
  viewDetails: {
    justifyContent: "center",
    marginLeft: 10,
  },
  viewDetailsText: {
    color: "#180161",
    textDecorationLine: "underline",
  },
  modalView: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -width * 0.4 }, { translateY: -height * 0.4 }],
    width: width * 0.8,
    maxHeight: height * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#180161",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  bulletPointContainer: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  bulletSubPoint: {
    fontSize: 14,
    color: "#333",
    marginLeft: 15,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: 80,
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  fullScreenImage: {
    width: width * 0.9,
    height: height * 0.9,
    resizeMode: "contain",
    borderRadius: 10,
  },
  closeFullScreenButton: {
    marginTop: 20,
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 5,
  },
});

export default RoomBooking;
