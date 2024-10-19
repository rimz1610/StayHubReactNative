import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { CARTMODEL } from "../../../constant";
import CustomLoader from "../../../../components/CustomLoader";
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import {
  getCartFromSecureStore,
  putDataIntoCartAndSaveSecureStore,
  deleteCartFromSecureStore,
  saveCartToSecureStore,
} from "../../../../components/secureStore";
const EventBooking = ({ route, navigation }) => {
 
  const [eventSelectList, setEventSelectList] = useState([]);
  const [selectEventId, setSelectEventId] = useState(0);
  const [selectedEventDetail, setSelectedEventDetail] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const [isValid, setIsValid] = useState(true);
  // const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [bookEventModel, setBookEventModel] = useState({
    eventId: 0,
    adultTickets: 0,
    childTickets: 0,
    itemTotalPrice: 0,
    index: 0,
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const LOADING_TIMEOUT = 10000;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectEventId(0);
      setEventSelectList([]);
      fetchEventDDData();
    }
  }, [isFocused]);

  const fetchEventDDData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://tehreemimran-001-site1.htempurl.com/Event/GetEventsForBooking"
      );

      if (response.data.success) {
        setEventSelectList(response.data.list);

        var firstEvent = response.data.list[0].value;
        handleSelectionChange(firstEvent);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetail = async (id) => {
    if (id > 0) {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://tehreemimran-001-site1.htempurl.com/Event/GetEventDetail?id=" +
          id
        );

        if (response.data.success) {
          setSelectedEventDetail(response.data.data);

          setBookEventModel({
            itemTotalPrice: 0,
            adultTickets: 0,
            childTickets: 0,
            eventId: id,
            name: response.data.data.name,
            index: 0,
          });
        } else {
          setSelectedEventDetail({
            id: 0,
            name: 0,
            childTicketPrice: 0,
            adultTicketPrice:0,
            description:"<p></p>",
            shortDescription:"",
            eventImage:"",


          });
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch event detail.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectionChange = (value) => {
    setSelectEventId(value);
    fetchEventDetail(value);
  };

  const calculateTotalPrice = () => {
    const totalPrice =
      bookEventModel.adultTickets * selectedEventDetail.adultTicketPrice +
      bookEventModel.childTickets * selectedEventDetail.childTicketPrice;
    setBookEventModel({ ...bookEventModel, itemTotalPrice: totalPrice });
  };

  const addToBookingCart = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token == null) {
      navigation.navigate("Login");
    }
    if (bookEventModel.itemTotalPrice == 0) {
      Alert.alert("Oops", "Please select a ticket.");
    }
    try {
      const response = await axios.post(
        "http://tehreemimran-001-site1.htempurl.com/Event/ValidateBookingEvent",
        bookEventModel
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
              onPress: () => { },
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                if ((await getCartFromSecureStore()) == null) {
                  const guestId = await AsyncStorage.getItem("loginId");
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
                  cart.lstEvent != null && cart.lstEvent.length > 0
                    ? cart.lstEvent.length + 1
                    : 1;
                setBookEventModel({ ...bookEventModel, index: index });
                const updatedCart = { ...cart };
                if (
                  updatedCart.lstEvent == undefined ||
                  updatedCart.lstEvent == null ||
                  updatedCart.lstEvent.length == 0
                ) {
                  updatedCart.lstEvent = [];
                }
                updatedCart.lstEvent.push({ ...bookEventModel, index: index });
                await saveCartToSecureStore(updatedCart);
                navigation.navigate("Cart");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        setIsValid(false);
        setErrorMessages(response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while validating tickets.");
    } finally {
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageLoading) {
        setImageError(true);
        setImageLoading(false);
      }
    }, LOADING_TIMEOUT);

    return () => clearTimeout(timer);
  }, [imageLoading]);

  const imageUrl = `http://tehreemimran-001-site1.htempurl.com/eventimages/${selectedEventDetail.eventImage}`;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          {/* <ActivityIndicator size="large" color="#180161" /> */}
          <CustomLoader />
          <Text style={styles.loadingText}>Loading Events...</Text>
        </View>
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Event and Date</Text>
            <RNPickerSelect
              onValueChange={handleSelectionChange}
              items={eventSelectList}
              value={selectEventId}
              placeholder={{ label: "Select Event and Date", value: 0 }}
              style={pickerSelectStyles}
            />
          </View>
          {selectEventId > 0 && selectedEventDetail.id > 0?
            <View style={styles.eventContainer}>
              <Text style={styles.eventTitle}>
                Event: {selectedEventDetail.name}
              </Text>
              <Text style={styles.eventDate}>
                Date:{" "}
                {moment(selectedEventDetail.eventDate).format("ddd MMM, YYYY")}
              </Text>
              <View style={styles.imageContainer}>
                {imageLoading && (
                  <View style={styles.loader}>
                    <CustomLoader />
                  </View>
                  // <ActivityIndicator
                  //   size="large"
                  //   color="#0000ff"
                  //   style={styles.loader}
                  // />
                )}
                <Image
                  style={[
                    styles.eventImage,
                    imageLoading && styles.hiddenImage,
                  ]}
                  source={
                    imageError
                      ? require("@/../../assets/images/placeholder.jpg")
                      : { uri: imageUrl }
                  }
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.heading}>Details</Text>

                <Text style={styles.description}>
                  {/* This is a dummy description of the selected event. It provides a
            brief overview of what the event is about. */}
                  {selectedEventDetail.shortDescription}
                </Text>
              </View>
              {/* <View style={styles.termsContainer}> */}
                <Text style={styles.heading}>Terms and Conditions</Text>
                {/* <Text style={styles.bullet}>• No refunds available.</Text>
          <Text style={styles.bullet}>• Must present a valid ID.</Text>
          <Text style={styles.bullet}>
            • Event starts at the specified time.
          </Text>  */}
                
              {/* </View> */}
              <RenderHtml contentWidth={100} source={{
                    html: selectedEventDetail.description
                  }}
                  contentStyle={{
                    padding: 2,
                  }}  />
              <View style={styles.ticketContainer}>
                <Text style={styles.ticketLabel}>No of Adult Tickets:</Text>
                <TextInput
                  style={styles.ticketInput}
                  keyboardType="numeric"
                  value={String(bookEventModel.adultTickets)}
                  onChangeText={(value) => {
                    const totalPrice =
                      value * selectedEventDetail.adultTicketPrice +
                      bookEventModel.childTickets *
                      selectedEventDetail.childTicketPrice;
                    setBookEventModel({
                      ...bookEventModel,
                      adultTickets: parseInt(value) || 0,
                      itemTotalPrice: totalPrice,
                    });
                  }}
                />
                <Text style={styles.ticketPrice}>
                  ${selectedEventDetail.adultTicketPrice} per adult
                </Text>
              </View>
              <View style={styles.ticketContainer}>
                <Text style={styles.ticketLabel}>No of Child Tickets:</Text>
                <TextInput
                  style={styles.ticketInput}
                  keyboardType="numeric"
                  value={String(bookEventModel.childTickets)}
                  onChangeText={(value) => {
                    const totalPrice =
                      bookEventModel.adultTickets *
                      selectedEventDetail.adultTicketPrice +
                      value * selectedEventDetail.childTicketPrice;
                    setBookEventModel({
                      ...bookEventModel,
                      childTickets: parseInt(value) || 0,
                      itemTotalPrice: totalPrice,
                    });
                  }}
                />

                <Text style={styles.ticketPrice}>
                  ${selectedEventDetail.childTicketPrice} per child
                </Text>
              </View>
              <Text style={styles.finalAmount}>
                Final Amount: ${bookEventModel.itemTotalPrice}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={addToBookingCart}
              >
                <Icon name="check" size={16} color="#fff" />
                <Text style={styles.buttonText}>Add To Booking</Text>
              </TouchableOpacity>
              {isValid === false ? (
                <Text style={styles.errorText}>{errorMessages}</Text>
              ) : null}
            </View>:<View><Text style={styles.booked}>Booking has been closed for the selected event.</Text></View>
          }
        </>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  hiddenImage: {
    opacity: 0,
  },
  loader: {
    position: "absolute",
    top: "40%",
    left: "35%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 10,
  },
  eventContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  eventImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#180161",
  },
 booked: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#180161",
    alignItems: "center",
  },
  
  description: {
    fontSize: 16,
    color: "#666",
  },
  termsContainer: {
    marginBottom: 20,
  },
  bullet: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  ticketContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  ticketInput: {
    width: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    textAlign: "center",
  },
  ticketPrice: {
    fontSize: 16,
    color: "#180161",
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#180161",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: "#fff",
  },
});

export default EventBooking;
