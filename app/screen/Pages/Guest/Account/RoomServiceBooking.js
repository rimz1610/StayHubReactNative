import React, { useState } from "react";
import {
  View,
  Text,Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCartFromSecureStore,
  putDataIntoCartAndSaveSecureStore,
  removeDataFromCartAndSaveLocalStorage,
  deleteCartFromSecureStore,
  saveCartToSecureStore,
} from "../../../../components/secureStore";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const categories = [
  { name: "House Keeping", icon: "cleaning-services" },
  { name: "Entertainment", icon: "movie" },
  { name: "Technology", icon: "devices" },
  { name: "Others", icon: "more-horiz" },
];

const services = [
  {
    id: 1,
    category: "House Keeping",
    title: "Clothes Washing",
    icon: "local-laundry-service",
    description: "Fresh and clean clothes",
    price: 10,
  },
  {
    id: 2,
    category: "House Keeping",
    title: "Room Cleaning",
    icon: "cleaning-services",
    description: "Thorough room cleaning",
    price: 15,
  },
  {
    id: 3,
    category: "House Keeping",
    title: "Bathroom Cleaning",
    icon: "bathtub",
    description: "Sparkling clean bathroom",
    price: 12,
  },
  {
    id: 4,
    category: "House Keeping",
    title: "Dry Cleaning",
    icon: "dry-cleaning",
    description: "Professional dry cleaning",
    price: 20,
  },
  {
    id: 5,
    category: "House Keeping",
    title: "Ironing",
    icon: "iron",
    description: "Wrinkle-free clothes",
    price: 8,
  },
  {
    id: 6,
    category: "House Keeping",
    title: "Extra Pillow and Blankets",
    icon: "bed",
    description: "Additional comfort items",
    price: 5,
  },
  {
    id: 7,
    category: "House Keeping",
    title: "Fresh Towels",
    icon: "dry",
    description: "Soft, clean towels",
    price: 5,
  },
  {
    id: 8,
    category: "House Keeping",
    title: "Toiletries Replenishment",
    icon: "sanitizer",
    description: "Restock bathroom essentials",
    price: 7,
  },
  {
    id: 9,
    category: "Entertainment",
    title: "Movie Rental",
    icon: "movie",
    description: "Latest movies on demand",
    price: 10,
  },
  {
    id: 10,
    category: "Entertainment",
    title: "Game Console Rental",
    icon: "sports-esports",
    description: "Popular gaming consoles",
    price: 15,
  },
  {
    id: 11,
    category: "Technology",
    title: "Wi-Fi Booster",
    icon: "wifi",
    description: "Enhanced internet connection",
    price: 8,
  },
  {
    id: 12,
    category: "Technology",
    title: "Phone Charger",
    icon: "phone-android",
    description: "Universal phone charger",
    price: 5,
  },
  {
    id: 13,
    category: "Others",
    title: "Room Service Dining",
    icon: "room-service",
    description: "In-room meal service",
    price: 25,
  },
  {
    id: 14,
    category: "Others",
    title: "Wake-up Call",
    icon: "access-alarm",
    description: "Personalized wake-up service",
    price: 0,
  },
];

const ServiceCard = ({ service, onPress }) => (

  <TouchableOpacity style={styles.card} onPress={() => onPress(service)}>
    <MaterialIcons
      name={service.icon}
      size={40}
      color="#3F2BAC"
      style={styles.cardIcon}
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{service.title}</Text>
      <Text style={styles.cardDescription}>{service.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>${service.price}</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onPress(service)}
        >
          <Text style={styles.bookButtonText}>Book</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const RoomServiceBooking = ({route,navigation}) => {
  const roomId = route.params?.roomId || 0;
  const roomName = route.params?.roomName || 0;
  const [activeCategory, setActiveCategory] = useState("House Keeping");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
 
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [roomServceModel, setRoomServiceModel] = useState({
    index: 0,
    roomId:roomId,
    roomName: roomName,
    serviceName: "",
    description: "",
    requestDate: new Date(),
    price: 0
  })
  const handleServicePress = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleBooking = () => {


      Alert.alert(
      "Confirm",
      "Are you sure you want to book?",
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
              await saveCartToSecureStore({
                bookingModel: {
                  id: 0,
                  referenceNumber: " ",
                  bookingAmount: 0,
                  bookingDate: new Date(),
                  paidAmount: 0,
                  status: "UnPaid",
                  notes: " ",
                  guestId: guestId,
                },
                paymentDetail: {
                  cardNumber: "4242424242424242",
                  nameOnCard: "Test",
                  expiryYear: "2025",
                  expiryMonth: "01",
                  cVV: "123",
                  transactionId: " ",
                },
                lstRoom: [],
                lstRoomService: [],
                lstGym: [],
                lstSpa: [],
                lstEvent: [],
              });
            }
            const cart = await getCartFromSecureStore();
            const index =
              cart.lstRoomService != null && cart.lstRoomService.length > 0
                ? cart.lstRoomService.length + 1
                : 1;
            console.warn(cart.lstRoomService);
            setRoomServiceModel({ ...roomServceModel, index: index });
            const updatedCart = { ...cart };
            if (
              updatedCart.lstRoomService == undefined ||
              updatedCart.lstRoomService == null ||
              updatedCart.lstRoomService.length == 0
            ) {
              updatedCart.lstRoomService = [];
            }
            updatedCart.lstRoomService.push({  index: index,
              roomId:roomId,
              roomName: roomName,
              serviceName: selectedService.title,
              description: roomServceModel.description,
              requestDate: roomServceModel.requestDate,
              price: selectedService.price});
            await saveCartToSecureStore(updatedCart);
            setModalVisible(false);
            console.warn(await getCartFromSecureStore());
            navigation.navigate("Cart");
          },
        },
      ],
      { cancelable: false }
    );

  };
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setRoomServiceModel({...roomServceModel, requestDate:selectedTime});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryTab,
              activeCategory === category.name && styles.activeCategoryTab,
            ]}
            onPress={() => setActiveCategory(category.name)}
          >
            <MaterialIcons
              name={category.icon}
              size={24}
              color={activeCategory === category.name ? "#fff" : "#3F2BAC"}
            />
            <Text
              style={[
                styles.categoryTabText,
                activeCategory === category.name &&
                styles.activeCategoryTabText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.servicesContainer}>
        {services
          .filter((service) => service.category === activeCategory)
          .map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={handleServicePress}
            />
          ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.modalTitle}>{selectedService?.title}</Text>
              <Text style={styles.modalLabel}>Choose Time:</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timePickerButtonText}>
                  {roomServceModel.requestDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              <Text style={styles.modalLabel}>Description:</Text>
              <TextInput
                style={styles.modalInput}
                multiline
                numberOfLines={3}
                value={roomServceModel.description}
                onChangeText={(e)=>{setRoomServiceModel({...roomServceModel,description:e})}}
                placeholder="Add any special requests or notes"
                placeholderTextColor="#A0A0A0"
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleBooking}
            >
              <Text style={styles.modalButtonText}>Book Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="#180161" />
            </TouchableOpacity>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={roomServceModel.requestDate}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={handleTimeChange}
              style={{
                backgroundColor: "#fff",
                position: "absolute",
                bottom: 0,
                width: "100%",
              }}
              textColor="#180161"
            />
          )}
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F7",
  },
  categoryTabs: {
    flexGrow: 0,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#E8E4F8",
  },
  activeCategoryTab: {
    backgroundColor: "#180161",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3F2BAC",
    marginLeft: 5,
  },
  activeCategoryTabText: {
    color: "#fff",
  },
  servicesContainer: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    marginRight: 15,
    alignSelf: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3F2BAC",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#180161",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#180161",
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#3F2BAC",
    alignSelf: "flex-start",
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: "#E8E4F8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  timePickerButtonText: {
    fontSize: 16,
    color: "#180161",
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E8E4F8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    minHeight: 100,
    color: "#180161",
    textAlignVertical: "top",
  },
  modalButton: {
    width: "50%",
    backgroundColor: "#180161",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  modalButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default RoomServiceBooking;
