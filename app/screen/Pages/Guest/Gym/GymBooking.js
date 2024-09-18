import React, { useState, useEffect, useCallback } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/FontAwesome";
import Carousel from "react-native-reanimated-carousel";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { CARTMODEL } from "../../../constant";
import {
  getCartFromSecureStore,
  putDataIntoCartAndSaveSecureStore,
  saveCartToSecureStore,
  deleteCartFromSecureStore,
} from "../../../../components/secureStore";

const { width, height } = Dimensions.get("window");

const GymBooking = ({ navigation }) => {
  const [gymList, setGymList] = useState([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedMonths, setSelectedMonths] = useState({}); // Initialize as an object
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentGymDetails, setCurrentGymDetails] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [imageError, setImageError] = useState({});

  const [carouselImages, setCarouselImages] = useState([
    { uri: require("../../../../../assets/images/gym.jpg"), loaded: false },
    { uri: require("../../../../../assets/images/gym-one.jpg"), loaded: false },
    { uri: require("../../../../../assets/images/gym-two.jpg"), loaded: false },
  ]);
  const [bookGymModel, setBookGymModel] = useState({
    gymId: 0,
    monthRange: 0,
    price: 0,
    index: 0,
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const genderOptions = ["All", "Male", "Female"];
  const monthOptions = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

  useEffect(() => {
    if (isFocused) {
      setGymList([]);
      fetchGyms();
    }
  }, [isFocused]);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Gym/GetGyms?gender=" +
          selectedGender
      );

      if (response.data.success) {
        setGymList(response.data.list);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch gyms.");
    } finally {
      setLoading(false);
    }
  };

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
      fetchGyms();
    } else {
      setSelectedMonths({ ...selectedMonths, [currentDropdown]: option });
    }
    closeDropdown();
  };

  // const carouselImages = [
  //   require("../../../../../assets/images/gym.jpg"),
  //   require("../../../../../assets/images/gym-one.jpg"), // Add more images as needed
  //   require("../../../../../assets/images/gym-two.jpg"),
  // ];

  const openDetailModal = (gym) => {
    setCurrentGymDetails(gym);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
  };

  const addToBookingCart = async (gym) => {
    // const selectedMonth = selectedMonths[gym.id];
    const selectedMonth = selectedMonths[gym.id];
    const monthRange = Object.values(selectedMonth)[0];
    console.log(gym.price);
    setBookGymModel({
      ...bookGymModel,
      price: gym.price,
      name: gym.name + ", For " + gym.gender,
      gymId: gym.id,
      monthRange: monthRange,
    });
    const token = await AsyncStorage.getItem("token");
    if (token == null) {
      navigation.navigate("Login");
    }
    try {
      console.warn(bookGymModel);
      const response = await axios.post(
        "http://majidalipl-001-site5.gtempurl.com/Gym/ValidateGymCapacity",
        bookGymModel
      );
      if (response.data.success) {
        setIsValid(true);
        setErrorMessages("");
        Alert.alert(
          "Confirm",
          "Are you sure you want to continue?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                if ((await getCartFromSecureStore()) == null) {
                  console.log("Cart was empty");
                  const guestId = await AsyncStorage.getItem("loginId");
                  console.warn(guestId);
                  await saveCartToSecureStore(
                    {
                      bookingModel: {
                        id: 0, referenceNumber: " ", bookingAmount: 0,
                        bookingDate: new Date(),
                        paidAmount: 0, status: "UnPaid",
                        notes: " ", guestId: guestId,
                      },
                      paymentDetail: {
                        paidAmount: 0, bookingId: 0,
                        cardNumber: "4242424242424242", nameOnCard: "Test", expiryYear: "2025",
                        expiryMonth: "01", cVV: "123", transactionId: " "
                      },
                      lstRoom: [], lstRoomService: [],
                      lstGym: [], lstSpa: [], lstEvent: []
                    }
                  );
                 
                }
                const cart = await getCartFromSecureStore();
                const index =
                  cart.lstGym != null && cart.lstGym.length > 0
                    ? cart.lstGym.length + 1
                    : 1;
                console.warn(cart.lstGym);
                setBookGymModel({ ...bookGymModel, index: index });
                const updatedCart = { ...cart };
                if (
                  updatedCart.lstGym == undefined ||
                  updatedCart.lstGym == null ||
                  updatedCart.lstGym.length == 0
                ) {
                  updatedCart.lstGym = [];
                }
                updatedCart.lstGym.push({ ...bookGymModel, index: index });
                await saveCartToSecureStore(updatedCart);
                console.warn(await getCartFromSecureStore());
                navigation.navigate("Cart");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.warn(response.data.message);
        Alert.alert("Error", response.data.message);
        setIsValid(false);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "An error occurred while validating capacity.");
    } finally {
    }
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

  const placeholderImage = require("../../../../../assets/images/placeholder.jpg");
  const onImageLoad = useCallback((index) => {
    setCarouselImages((prevImages) =>
      prevImages.map((img, i) => (i === index ? { ...img, loaded: true } : img))
    );
  }, []);
  const renderCarouselItem = useCallback(
    ({ item, index }) => (
      <View style={styles.carouselImageContainer}>
        <Image
          source={item.loaded ? item.uri : placeholderImage}
          style={styles.carouselImage}
          contentFit="cover"
          transition={300}
          onLoad={() => onImageLoad(index)}
        />
        {!item.loaded && (
          <ActivityIndicator
            style={styles.imageLoader}
            size="large"
            color="#180161"
          />
        )}
      </View>
    ),
    [onImageLoad]
  );
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
          renderItem={renderCarouselItem}
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
        {gymList != undefined &&
          gymList.map((gym, index) => {
            return (
              <View style={styles.boxcontainer} key={index}>
                <View style={styles.box}>
                  <Text
                    style={styles.title}
                    onPress={() => openDetailModal(gym)}
                  >
                    {gym.name}
                  </Text>
                  <Text style={styles.timing}>
                    Timing: {gym.openingTime} - {gym.closingTime}
                  </Text>
                  <Text style={styles.fee}>Fee: ${gym.fee}</Text>

                  <Text style={styles.sessionLabel}>Monthly Session</Text>

                  {renderDropdown(gym.id, selectedMonths[gym.id])}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={async () => await addToBookingCart(gym)}
                  >
                    <Icon name="calendar" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
            <Text style={styles.modalTitle}>{currentGymDetails.name}</Text>
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
    textDecorationLine: "underline",
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
  // viewDetailsButtonText: {
  //   fontSize: 14,
  //   textDecorationLine: "underline",
  //   fontWeight: "bold",
  //   color: "#180161",
  //   marginBottom: 5,
  // },
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
