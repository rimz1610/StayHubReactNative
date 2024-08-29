import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const GymBooking = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedMonths, setSelectedMonths] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentGymDetails, setCurrentGymDetails] = useState({});

  const genderOptions = ["Male", "Female"];
  const monthOptions = ["1 Month", "3 Months", "6 Months"];

  const openDropdown = (type) => {
    setCurrentDropdown(type);
    setModalVisible(true);
  };

  const closeDropdown = () => {
    setModalVisible(false);
    setCurrentDropdown(null);
  };

  const selectOption = (option) => {
    if (currentDropdown === "gender") {
      setSelectedGender(option);
    } else {
      setSelectedMonths({ ...selectedMonths, [currentDropdown]: option });
    }
    closeDropdown();
  };

  const carouselImages = [
    require("../../../../../assets/images/gym.jpg"),
    require("../../../../../assets/images/gym-one.jpg"), // Add more images as needed
    require("../../../../../assets/images/gym-two.jpg"),
  ];

  const gymDetails = {
    title: "GymKhana",
    description:
      "GymKhana offers state-of-the-art equipment, a variety of fitness classes, and professional trainers to help you achieve your fitness goals. Follow our gym rules to ensure a safe and enjoyable environment for everyone.",
    equipment: "Treadmills, Dumbbells, Squat Racks, Ellipticals, and more.",
    rules:
      "Please wipe down equipment after use. No dropping weights. Respect fellow gym members.",
  };
  const openDetailModal = (gym) => {
    setCurrentGymDetails(gym);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
  };

  const renderDropdown = (type, selectedValue, customStyle = {}) => (
    <TouchableOpacity
      style={[styles.dropdown, customStyle]}
      onPress={() => openDropdown(type)}
    >
      <Text style={styles.dropdownText}>
        {selectedValue || `Select ${type === "gender" ? "Gender" : "Month"}`}
      </Text>
      <Icon name="chevron-down" size={14} color="#666" />
    </TouchableOpacity>
  );

  const renderGymBox = (id, title, timing, fee) => {
    return (
      <View style={styles.boxcontainer}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timing}>Timing: {timing}</Text>
          <Text style={styles.fee}>Fee: ${fee}</Text>
          {/* <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => openDetailModal(gymDetails)}
          > */}
          <Text
            style={styles.viewDetailsButtonText}
            onPress={() => openDetailModal(gymDetails)}
          >
            View Details
          </Text>
          {/* </TouchableOpacity> */}
          <Text style={styles.sessionLabel}>Monthly Session</Text>
          {renderDropdown(id, selectedMonths[id])}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("BookingItems")}
          >
            <Icon name="calendar" size={16} color="#fff" />
            <Text style={styles.buttonText}>Booking Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={width * 0.7}
          autoPlay={true}
          data={carouselImages}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />
      </View>
      <View style={styles.tagContainerWrapper}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Gym Services</Text>
        </View>
      </View>
      <View style={styles.genderSection}>
        <Text style={styles.genderTitle}>Select Gender</Text>
        {renderDropdown("gender", selectedGender, styles.genderDropdown)}
      </View>

      <View style={styles.row}>
        {renderGymBox("gym1", "GymKhana", "6am - 11am", 150)}
        {renderGymBox("gym2", "GymKhana", "12pm - 5pm", 150)}
      </View>
      <View style={styles.row}>
        {renderGymBox("gym3", "GymKhana", "6pm - 11pm", 180)}
        {renderGymBox("gym4", "GymKhana", "12am - 5am", 130)}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeDropdown}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={currentDropdown === "gender" ? genderOptions : monthOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectOption(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <Text style={styles.modalTitle}>{currentGymDetails.title}</Text>
            <Text style={styles.modalDescription}>
              {currentGymDetails.description}
            </Text>
            <Text style={styles.modalSubtitle}>Equipment Available:</Text>
            <Text style={styles.modalText}>{currentGymDetails.equipment}</Text>
            <Text style={styles.modalSubtitle}>Gym Rules:</Text>
            <Text style={styles.modalText}>{currentGymDetails.rules}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeDetailModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  boxcontainer: {
    padding: 10,
  },
  carouselContainer: {
    width: width,
    height: width * 0.7,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tagContainerWrapper: {
    alignItems: "center",
    marginTop: -20,
    marginBottom: 20,
  },
  tagContainer: {
    backgroundColor: "#180161",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tagText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  genderSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 10,
  },
  genderDropdown: {
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  box: {
    width: width * 0.44,
    height: height * 0.3, // Adjusted height to accommodate the button
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  timing: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  fee: {
    fontSize: 16,
    fontWeight: "600",
    color: "#180161",
    marginBottom: 5,
  },
  sessionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#180161",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: Platform.OS === "android" ? 5 : 10, // Adjusted marginTop for Android
    marginBottom: Platform.OS === "android" ? 15 : 10, // Added bottom margin for Android
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    width: width * 0.8,
    maxHeight: height * 0.5,
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  viewDetailsButtonText: {
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  detailModalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#180161",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default GymBooking;
