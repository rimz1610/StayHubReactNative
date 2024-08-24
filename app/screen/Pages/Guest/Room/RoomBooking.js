import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import RoomImage from "../../../../../assets/images/room.jpg";
import RoomImage1 from "../../../../../assets/images/room-one.jpg";
import RoomImage2 from "../../../../../assets/images/room-two.jpg";
import RoomImage3 from "../../../../../assets/images/room-three.jpg";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import { Calendar } from "react-native-calendars";
import { differenceInDays, format } from "date-fns";
import RNPickerSelect from "react-native-picker-select";

const RoomBooking = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nights, setNights] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [additionalPerson, setAdditionalPerson] = useState(1);
  const [roomType, setRoomType] = useState("Single");

  const handleDateSelect = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date.dateString);
      setEndDate(null);
    } else {
      setEndDate(date.dateString);
      const nights = differenceInDays(
        new Date(date.dateString),
        new Date(startDate)
      );
      setNights(nights);
    }
  };

  const getMarkedDates = () => {
    if (!startDate) return {};

    const markedDates = {
      [startDate]: { startingDay: true, color: "#180161", textColor: "white" },
    };

    if (endDate) {
      markedDates[endDate] = {
        endingDay: true,
        color: "#180161",
        textColor: "white",
      };

      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      while (currentDate < end) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = format(currentDate, "yyyy-MM-dd");
        if (dateString !== endDate) {
          markedDates[dateString] = { color: "#180161", textColor: "white" };
        }
      }
    }

    return markedDates;
  };

  const renderRoomItem = (name, type, price, image) => (
    <View style={styles.roomItem}>
      <Image source={image} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{name}</Text>
        <Text style={styles.roomType}>{type}</Text>
        <Text style={styles.roomPrice}>${price}/night</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setShowDetails(true)}
            style={styles.viewDetails}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /* Handle booking */
            }}
            style={styles.bookingButton}
          >
            <Ionicons name="calendar" size={17} color="#fff" />
            <Text style={styles.bookingButtonText}>Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setShowDetails(false);
  };

  const additionalPersonOptions = Array.from({ length: 10 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));

  const roomTypeOptions = [
    "Single",
    "Double",
    "Triple",
    "Twin",
    "King",
    "Queen",
    "Suite",
    "Studio",
  ].map((type) => ({ label: type, value: type }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateSection}>
        <Text style={styles.sectionLabel}>Select Your Stay Dates</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {startDate && endDate
              ? `${format(new Date(startDate), "MMM dd, yyyy")} - ${format(
                  new Date(endDate),
                  "MMM dd, yyyy"
                )}`
              : "Select dates"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.calendarModalView}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            markingType={"period"}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#180161",
              selectedDayBackgroundColor: "#180161",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#180161",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#180161",
              selectedDotColor: "#ffffff",
              arrowColor: "#180161",
              monthTextColor: "#180161",
              indicatorColor: "#180161",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCalendar(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.stayInfo}>
        <Text style={styles.stayInfoText}>
          Check-in:{" "}
          {startDate
            ? format(new Date(startDate), "MMM dd, yyyy")
            : "Not selected"}
        </Text>
        <Text style={styles.stayInfoText}>
          Check-out:{" "}
          {endDate ? format(new Date(endDate), "MMM dd, yyyy") : "Not selected"}
        </Text>
        <Text style={styles.stayInfoText}>Number of Nights: {nights}</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Persons</Text>
            <RNPickerSelect
              onValueChange={(value) => setAdditionalPerson(value)}
              items={additionalPersonOptions}
              style={pickerSelectStyles}
              value={additionalPerson}
              placeholder={{}}
              Icon={() => (
                <Ionicons name="chevron-down" size={24} color="#180161" />
              )}
            />
          </View>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Room Type</Text>
            <RNPickerSelect
              onValueChange={(value) => setRoomType(value)}
              items={roomTypeOptions}
              style={pickerSelectStyles}
              value={roomType}
              placeholder={{}}
              Icon={() => (
                <Ionicons name="chevron-down" size={24} color="#180161" />
              )}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#fff" />
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
    backgroundColor: "#f5f5f5",
  },
  dateSection: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#180161",
  },
  datePickerButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#180161",
    fontWeight: "600",
  },
  calendarModalView: {
    backgroundColor: "white",
    margin: 20,
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
  closeButton: {
    backgroundColor: "#180161",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  stayInfo: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 20,
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
  stayInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  availableRoomsHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 20,
    color: "#180161",
  },
  roomItem: {
    flexDirection: "row",
    marginBottom: 15,
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  roomImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10,
  },
  roomInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
  },
  roomType: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
  },
  viewDetails: {
    padding: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#180161",
  },
  viewDetailsText: {
    color: "#180161",
    fontSize: 12,
    fontWeight: "bold",
  },
  bookingButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#180161",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 12,
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
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: 10,
  },
  pickerWrapper: {
    width: "48%",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#180161",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#180161",
    paddingRight: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#180161",
    paddingRight: 30,
    backgroundColor: "#fff",
    elevation: 2,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default RoomBooking;
