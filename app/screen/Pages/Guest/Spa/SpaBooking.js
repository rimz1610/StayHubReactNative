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
  Image,
  Alert,
} from "react-native";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { CARTMODEL } from "../../../constant";
import {
  getCartFromSecureStore,
  putDataIntoCartAndSaveSecureStore,
  deleteCartFromSecureStore,
  saveCartToSecureStore,
} from "../../../../components/secureStore";

const { width } = Dimensions.get("window");
const ServiceCard = ({ spa, navigation }) => {
  const [errorMessages, setErrorMessages] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [bookSpaModel, setBookSpaModel] = useState({
    spaId: spa.id,
    noOfPersons: 1,
    spaDate: new Date(),
    itemTotalPrice: spa.price,
    index: 0,
    name: spa.name,
    price: spa.price,
    time: spa.openingTime + " - " + spa.closingTime,
  });

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setBookSpaModel({ ...bookSpaModel, spaDate: selectedDate });
    hideDatePicker();
  };

  const adjustPersons = (increment) => {
    const newValue = bookSpaModel.noOfPersons + increment;
    if (newValue >= 1 && newValue <= 10) {
      setBookSpaModel({
        ...bookSpaModel,
        noOfPersons: newValue,
        itemTotalPrice: spa.price * newValue,
      });
    } else {
      setBookSpaModel({
        ...bookSpaModel,
        noOfPersons: bookSpaModel.noOfPersons,
        itemTotalPrice: spa.price * bookSpaModel.noOfPersons,
      });
    }
    // setPersons((prevPersons) => {
    //   const newValue = prevPersons + increment;
    //   return newValue >= 1 && newValue <= 10 ? newValue : prevPersons;
    // });
  };

  const addToBookingCart = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token == null) {
      navigation.navigate("Login");
    }
    if (bookSpaModel.price == 0) {
      Alert.alert("Oops", "Please select spa");
    }
    try {
      const response = await axios.post(
        "http://majidalipl-001-site5.gtempurl.com/Spa/ValidateSpaCapacity",
        bookSpaModel
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
                  cart.lstSpa != null && cart.lstSpa.length > 0
                    ? cart.lstSpa.length + 1
                    : 1;
                console.warn(cart.lstSpa);
                setBookSpaModel({ ...bookSpaModel, index: index });
                const updatedCart = { ...cart };
                if (
                  updatedCart.lstSpa == undefined ||
                  updatedCart.lstSpa == null ||
                  updatedCart.lstSpa.length == 0
                ) {
                  updatedCart.lstSpa = [];
                }
                updatedCart.lstSpa.push({ ...bookSpaModel, index: index });
                await saveCartToSecureStore(updatedCart);
                console.warn(await getCartFromSecureStore());
                navigation.navigate("Cart");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", response.data.message);
        setIsValid(false);
        setErrorMessages(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", "An error occurred while validating capacity.");
    } finally {
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{spa.name}</Text>
        <Text style={styles.price}>{spa.price}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.description}>{spa.description}</Text>
        <Text style={styles.label}>Timing</Text>
        <Text style={styles.dateText}>
          {spa.openingTime}-{spa.closingTime}
        </Text>
        <Text style={styles.label}>Service Date and Time</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <Icon
            name="event"
            size={20}
            color="#180161"
            style={styles.dateIcon}
          />
          <Text style={styles.dateText}>
            {moment(bookSpaModel.spaDate).format("MMM DD YYYY")}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Text style={styles.label}>Number of Persons</Text>
        <View style={styles.personSelector}>
          <TouchableOpacity
            onPress={() => adjustPersons(-1)}
            style={styles.personButton}
          >
            <Icon name="remove" size={24} color="#180161" />
          </TouchableOpacity>
          <Text style={styles.personCount}>{bookSpaModel.noOfPersons}</Text>
          <TouchableOpacity
            onPress={() => adjustPersons(1)}
            style={styles.personButton}
          >
            <Icon name="add" size={24} color="#180161" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={addToBookingCart}>
          <Icon name="spa" size={24} color="white" />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SpaBooking = ({ navigation }) => {
  const [spaList, setSpaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [carouselImages, setCarouselImages] = useState([
    { uri: require("../../../../../assets/images/spa.jpg"), loaded: false },
    { uri: require("../../../../../assets/images/spa3.jpg"), loaded: false },
    {
      uri: require("../../../../../assets/images/spa2.jpg"),
      loaded: false,
    },
  ]);
  const services = [
    {
      title: "Hydrant Facial",
      description: "Rejuvenating facial treatment",
      price: 80,
    },
    {
      title: "Body Wrap",
      description: "Detoxifying body wrap",
      price: 120,
    },
    {
      title: "Cellulite Treatment",
      description: "Effective cellulite reduction",
      price: 150,
    },
    {
      title: "Manicure & Pedicure",
      description: "Relaxing hand and foot care",
      price: 60,
    },
    {
      title: "Destress Massage",
      description: "Soothing full body massage",
      price: 100,
    },
    {
      title: "Steam Room",
      description: "Cleansing steam therapy",
      price: 40,
    },
  ];
  useEffect(() => {
    if (isFocused) {
      setSpaList([]);
      fetchSpas();
    }
  }, [isFocused]);

  const fetchSpas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://majidalipl-001-site5.gtempurl.com/Spa/GetSpas"
      );
      if (response.data.success) {
        setSpaList(response.data.list);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch spas.");
    } finally {
      setLoading(false);
    }
  };
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
    <ScrollView style={styles.container}>
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
          <Text style={styles.tagText}>Luxurious Spa Services</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#180161" />
          <Text style={styles.loadingText}>Loading Spas...</Text>
        </View>
      ) : spaList.length > 0 ? (
        spaList.map((service, index) => (
          <ServiceCard key={index} spa={service} navigation={navigation} />
        ))
      ) : (
        <Text style={styles.noDataText}>No spa services available.</Text>
      )}
    </ScrollView>
  );
};

export default SpaBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Adjust as needed
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#34495e",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  carouselContainer: {
    width: width,
    height: width * 0.7,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  carouselImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  imageLoader: {
    position: "absolute",
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
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#180161",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 15,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 15,
    marginBottom: 5,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    color: "#34495e",
    fontSize: 16,
  },
  personSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    padding: 5,
    marginBottom: 15,
  },
  personButton: {
    padding: 5,
  },
  personCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  bookButton: {
    backgroundColor: "#180161",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
