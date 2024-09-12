import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View, ScrollView,
  FlatList, Image,
  ActivityIndicator,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { CARTMODEL } from "../../../constant";
import { getCartFromSecureStore, putDataIntoCartAndSaveSecureStore, deleteCartFromSecureStore } from "../../../../components/secureStore";
const EventBooking = ({ route, navigation }) => {
  const [eventSelectList, setEventSelectList] = useState([]);
  const [selectEventId, setSelectEventId] = useState(0);
  const [selectedEventDetail, setSelectedEventDetail] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [cartModel, setCartModel] = useState(CARTMODEL)
  const [bookEventModel, setBookEventModel] = useState({
    eventId: 0, adultTickets: 0, childTickets: 0,
    itemTotalPrice: 0, index: 0, name: ""
  });
  const [loading, setLoading] = useState(false);

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
      const response = await axios.get("http://majidalipl-001-site5.gtempurl.com/Event/GetEventsForBooking"
      );

      if (response.data.success) {
        setEventSelectList(response.data.list);
        // var firstEvent = response.data.list[0].value;
        // handleSelectionChange(firstEvent);
      } else {
        console.warn("select list");
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.warn("select list");
      console.warn(error);
      Alert.alert("Error", "Failed to fetch events.");

    } finally {
      setLoading(false);
    }
  };


  const fetchEventDetail = async (id) => {
    if (id > 0) {
      setLoading(true);
      try {
        const response = await axios.get("http://majidalipl-001-site5.gtempurl.com/Event/GetEventDetail?id=" + id
        );

        if (response.data.success) {
          setSelectedEventDetail(response.data.data);
          console.warn(response.data.data)
          setBookEventModel({
            itemTotalPrice: 0, adultTickets: 0,
            childTickets: 0, eventId: id, name: response.data.data.name, index: 0
          });

        } else {
          console.warn("event detail");
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        console.warn("event detail");
        console.warn(error);
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


    const totalPrice = (bookEventModel.adultTickets * selectedEventDetail.adultTicketPrice) +
      (bookEventModel.childTickets * selectedEventDetail.childTicketPrice);
    setBookEventModel({ ...bookEventModel, itemTotalPrice: totalPrice });
  };

  const addToBookingCart = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token == null) {
      navigation.navigate("Login")
    }
    if (bookEventModel.itemTotalPrice == 0) {
      Alert.alert("Oops", "Please select a ticket.");
    }
    try {

      const response = await axios.post(
        "http://majidalipl-001-site5.gtempurl.com/Event/ValidateBookingEvent",
        bookEventModel
      );
      if (response.data.success) {
        setIsValid(true);
        setErrorMessages("");
        Alert.alert(
          'Confirm',
          'Are you sure you want to continue?',
          [
            {
              text: 'Cancel',
              onPress: () => {

              },
              style: 'cancel',
            },
            {
              text: 'Yes', onPress: async () => {
               
                const cart = await getCartFromSecureStore();

                if (cart == null) {
                  var guestId = await AsyncStorage.getItem('loginId');
                  await putDataIntoCartAndSaveSecureStore(
                    {
                      id: 0,
                      referenceNumber: " ",
                      bookingAMount: 0,
                      bookingDate: new Date(),
                      paidAmount: 0,
                      status: "UnPaid",
                      notes: "",
                      guestId: guestId,
                  }, 'B');
                  
                }
                const index = (cart.lstEvent != null && cart.lstEvent.length > 0) ? cart.lstEvent.length + 1 : 1;
                console.warn(index);
                setBookEventModel({ ...bookEventModel, index: index });
                await putDataIntoCartAndSaveSecureStore(bookEventModel, 'E');
                //save in secure store
                console.warn(await getCartFromSecureStore());

              }
            },
          ],
          { cancelable: false },
        );

      } else {
        setIsValid(false);
        setErrorMessages(response.data.message);
      }
    } catch (error) {
      console.warn(error)
      Alert.alert("Error", "An error occurred while validating tickets.");
    }
    finally {
    }
  };




return (
  <ScrollView contentContainerStyle={styles.container}>
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
    {selectEventId > 0 &&
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>Event: {selectedEventDetail.name}</Text>
        <Text style={styles.eventDate}>Date: {moment(selectedEventDetail.eventDate).format("dd MMM, YYYY")}</Text>
        <Image
          style={styles.eventImage}
          source={{
            uri: "http://majidalipl-001-site5.gtempurl.com/eventimages/" +
              selectedEventDetail.eventImage,
          }}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>Details</Text>

          <Text style={styles.description}>
            {/* This is a dummy description of the selected event. It provides a
            brief overview of what the event is about. */}
            {selectedEventDetail.shortDescription}
          </Text>
        </View>
        <View style={styles.termsContainer}>
          <Text style={styles.heading}>Terms and Conditions</Text>
          {/* <Text style={styles.bullet}>• No refunds available.</Text>
          <Text style={styles.bullet}>• Must present a valid ID.</Text>
          <Text style={styles.bullet}>
            • Event starts at the specified time.
          </Text>  */}
          <Text>{selectedEventDetail.description}</Text>
        </View>
        <View style={styles.ticketContainer}>
          <Text style={styles.ticketLabel}>No of Adult Tickets:</Text>
          <TextInput
            style={styles.ticketInput}
            keyboardType="numeric"
            value={String(bookEventModel.adultTickets)}
            onChangeText={(value) => {
              const totalPrice = (value * selectedEventDetail.adultTicketPrice) +
                (bookEventModel.childTickets * selectedEventDetail.childTicketPrice);
              setBookEventModel({
                ...bookEventModel, adultTickets: parseInt(value) || 0,
                itemTotalPrice: totalPrice
              },
              );

            }}
          />

          <Text style={styles.ticketPrice}>${selectedEventDetail.adultTicketPrice} per adult</Text>
        </View>
        <View style={styles.ticketContainer}>
          <Text style={styles.ticketLabel}>No of Child Tickets:</Text>
          <TextInput
            style={styles.ticketInput}
            keyboardType="numeric"
            value={String(bookEventModel.childTickets)}
            onChangeText={(value) => {
              const totalPrice = (bookEventModel.adultTickets * selectedEventDetail.adultTicketPrice) +
                (value * selectedEventDetail.childTicketPrice);
              setBookEventModel({
                ...bookEventModel, childTickets: parseInt(value) || 0,
                itemTotalPrice: totalPrice
              },
              );

            }}
          />

          <Text style={styles.ticketPrice}>${selectedEventDetail.childTicketPrice} per child</Text>
        </View>
        <Text style={styles.finalAmount}>Final Amount: ${bookEventModel.itemTotalPrice}</Text>
        <TouchableOpacity style={styles.button} onPress={addToBookingCart}>
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.buttonText}>Add To Booking</Text>
        </TouchableOpacity>
        {isValid == false ? (
          <Text style={styles.errorText}>{errorMessages}</Text>
        ) : null}
      </View>}
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
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
