import React, { useState, useEffect } from "react";
import {
  View,
  Text, Alert, TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getCartFromSecureStore, putDataIntoCartAndSaveSecureStore, removeDataFromCartAndSaveLocalStorage, deleteCartFromSecureStore, saveCartToSecureStore } from "../../../../components/secureStore";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
const paymentSchema = Yup.object().shape({
  cardNumber: Yup.string().max(16).required("Required"),
  nameOnCard: Yup.string().required("Required"),
  expiryYear: Yup.string().required("Required"),
  expiryMonth: Yup.string().required("Required"),
  cVV: Yup.string().min(4).max(4).required("Required")
});
const ConfirmBooking = ({ navigation }) => {

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [bookings, setBookings] = useState([
  //   { name: "Deluxe Room", details: "2 nights, Ocean View", totalItem: 300 },
  //   {
  //     name: "Event Booking",
  //     details: "Conference Room A, 1 day",
  //     totalItem: 200,
  //   },
  //   { name: "Gym Access", details: "2 days pass", totalItem: 40 },
  //   {
  //     name: "Spa Treatment",
  //     details: "Full Body Massage, 60 mins",
  //     totalItem: 120,
  //   },
  //   { name: "Room Service", details: "Cleaning, 2 times", totalItem: 50 },
  // ]);


  const handleDeleteBooking = (index, type) => {
    //setBookings(bookings.filter((_, i) => i !== index));
    removeDataFromCartAndSaveLocalStorage(index, type);
    FillItems();

  };

  // const totalAmount = bookings.reduce(
  //   (sum, booking) => sum + booking.totalItem,
  //   0
  // );

  const [cart, setCartModel] = useState({
    bookingModel: {
      id: 0, referenceNumber: " ", bookingAmount: 0,
      bookingDate: new Date(),
      paidAmount: 0, status: "UnPaid",
      notes: " ", guestId: 0,
    },
    paymentDetail: {
      paidAmount: 0, bookingId: 0,
      cardNumber: "4242424242424242", nameOnCard: "Test", expiryYear: "2025",
      expiryMonth: "01", cVV: "123", transactionId: " "
    },
    lstRoom: [], lstRoomService: [],
    lstGym: [], lstSpa: [], lstEvent: []
  });
  const isFocused = useIsFocused();

  const formik = useFormik({
    initialValues: {
      cardNumber: "", nameOnCard: "", expiryYear: "2024",
      expiryMonth: "01", cVV: ""
    },
    validationSchema: paymentSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        navigation.navigate("BookingReceipt")
        setSubmitting(true);
        setCartModel({
          ...cart, paymentDetail: {
            paidAmount: cart.bookingAmount, bookingId: 0,
            cardNumber: values.cardNumber, nameOnCard: values.nameOnCard, expiryYear: values.expiryYear,
            expiryMonth: values.expiryMonth, cVV: values.cVV, transactionId: "stayhub"
          }
        });
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Cart/Checkout",
          cart, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        if (response.data.success) {
          navigation.navigate("BookingReceipt", { id: response.data.data.id })
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "Something wnet wrong." + error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    if (isFocused) {
      FillItems();
    }
  }, [isFocused]);
  const FillItems = async () => {

    setLoading(true);
    try {
      setCartModel(await getCartFromSecureStore())
    } catch (error) {
      console.warn(error);
      Alert.alert("Error", error.message ?? "Something went wrong");

    } finally {
      setLoading(false);
    }
  };
  const getDetails = (type, item) => {

    switch (type) {
      case "R":
        const additional = item.maxPerson > 0 ? ` with ${item.maxPerson} additional person(s).` : ".";
        return `${item.roomName} - Check-in: ${item.checkInDate.toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}, Check-out: ${item.checkOutDate.toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}, Total ${item.noofNightStay} night(s)${additional}`;

      case "E":
        const aTicket = item.adultTickets > 0 ? ` Adult Ticket(s): ${item.adultTickets}` : ".";
        const cTicket = item.childTickets > 0 ? item.adultTickets > 0 ? `, ` : "" +
          ` Child Ticket(s): ${item.childTickets}` : "";
        return `${item.name} - ${aTicket}${cTicket}`;
      case "G":
        return `${item.name}, Month: ${item.monthRange}`;
      case "S":
        return `${item.name}, Total Persons:  ${item.noOfPersons}, Date ${moment(item.spaDate).format("MM/DD/YYYY")}, Timing ${item.time}`;
      case "RS":
        return `${item.roomName}, Service Request:  ${item.serviceName}, Request Date: ${moment(item.requestDate).format("MM/DD/YYYY")}`;
      default:
        return "";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#180161" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Booking</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bookingDetailsSection}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            {cart.lstRoom != null && cart.lstRoom.map((item, index) => (
              <View key={item.roomId + "room" + index} style={styles.bookingItem}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName}>Room</Text>
                  <Text style={styles.bookingDetails}>{getDetails("R", item)}</Text>
                  <Text style={styles.bookingTotal}>
                    {item.itemTotalPrice}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteBooking(item.index, "G")}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            {cart.lstRoomService != null && cart.lstRoomService.map((item, index) => (
              <View key={item.roomId + "roomservice" + index} style={styles.bookingItem}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName}>Service</Text>
                  <Text style={styles.bookingDetails}>{getDetails("RS", item)}</Text>
                  <Text style={styles.bookingTotal}>
                    {item.itemTotalPrice}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteBooking(item.index, "RS")}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            {cart.lstEvent != null && cart.lstEvent.map((item, index) => (
              <View key={item.eventId + "event" + index} style={styles.bookingItem}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName}>Event</Text>
                  <Text style={styles.bookingDetails}>{getDetails("E", item)}</Text>
                  <Text style={styles.bookingTotal}>
                    {item.itemTotalPrice}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteBooking(item.index, "E")}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            {cart.lstGym != null && cart.lstGym.map((item, index) => (
              <View key={item.gymId + "gym" + index} style={styles.bookingItem}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName}>Gym</Text>
                  <Text style={styles.bookingDetails}>{getDetails("G", item)}</Text>
                  <Text style={styles.bookingTotal}>
                    {item.price}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteBooking(item.index, "G")}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            {cart.lstSpa != null && cart.lstSpa.map((item, index) => (
              <View key={item.spaId + "spa" + index} style={styles.bookingItem}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName}>Spa</Text>
                  <Text style={styles.bookingDetails}>{getDetails("S", item)}</Text>
                  <Text style={styles.bookingTotal}>
                    {item.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteBooking(item.index, "S")}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            {/* {bookings.map((booking, index) => (
              <View key={index} style={styles.bookingItem}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingName}>{booking.name}</Text>
                <Text style={styles.bookingDetails}>{booking.details}</Text>
                <Text style={styles.bookingTotal}>
                  ${booking.totalItem.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteBooking(index)}
                style={styles.deleteButton}
              >
                <Icon name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            ))} */}
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>Total Amount:</Text>
              <Text style={styles.totalAmount}>{cart.bookingModel.bookingAmount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.paymentSection}>
            <View style={styles.paymentHeader}>
              <Icon name="credit-card" size={24} color="#180161" />
              <Text style={styles.sectionTitle}>Payment Details</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              placeholderTextColor="#888"
              onChangeText={formik.handleChange("nameOnCard")}
              onBlur={formik.handleBlur("nameOnCard")}
              value={formik.values.nameOnCard}
            />
            {formik.touched.nameOnCard && formik.errors.nameOnCard && (
              <Text style={styles.errorText}>
                {formik.errors.nameOnCard}
              </Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
              onChangeText={formik.handleChange("cardNumber")}
              onBlur={formik.handleBlur("cardNumber")}
              value={formik.values.cardNumber}
            />
            {formik.touched.cardNumber && formik.errors.cardNumber && (
              <Text style={styles.errorText}>
                {formik.errors.cardNumber}
              </Text>
            )}

            <View style={styles.row}>
              <RNPickerSelect
                onValueChange={(value) => formik.setFieldValue("expiryMonth", value)}
                value={formik.values.expiryMonth}
                items={[
                  { label: "01", value: "01" },
                  { label: "02", value: "02" },
                  { label: "03", value: "03" },
                  { label: "04", value: "04" },
                  { label: "05", value: "05" },
                  { label: "06", value: "06" },
                  { label: "07", value: "07" },
                  { label: "08", value: "08" },
                  { label: "09", value: "09" },
                  { label: "10", value: "10" },
                  { label: "11", value: "11" },
                  { label: "12", value: "12" },
                ]}
                style={pickerSelectStyles}
              />
              {formik.touched.expiryMonth && formik.errors.expiryMonth && (
                <Text style={styles.errorText}>{formik.errors.expiryMonth}</Text>
              )}
            </View>
            <View style={styles.row}>
              <RNPickerSelect
                onValueChange={(value) => formik.setFieldValue("expiryYear", value)}
                value={formik.values.expiryYear}
                items={[
                  { label: "2024", value: "2024" },
                  { label: "2025", value: "2025" },
                  { label: "2026", value: "2026" },
                  { label: "2027", value: "2027" },
                  { label: "2028", value: "2028" },
                  { label: "2029", value: "2029" },
                  { label: "2030", value: "2030" },
                  { label: "2031", value: "2031" },
                  { label: "2032", value: "2032" },
                  { label: "2033", value: "2033" },
                  { label: "2034", value: "2034" },
                ]}
                style={pickerSelectStyles}
              />
              {formik.touched.expiryYear && formik.errors.expiryYear && (
                <Text style={styles.errorText}>{formik.errors.expiryYear}</Text>
              )}
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.thirdInput]}
                placeholder="CVV"
                placeholderTextColor="#888"
                keyboardType="numeric"
                secureTextEntry
                onChangeText={formik.handleChange("cVV")}
                onBlur={formik.handleBlur("cVV")}
                value={formik.values.cVV}
              />
              {formik.touched.cVV && formik.errors.cVV && (
                <Text style={styles.errorText}>
                  {formik.errors.cVV}
                </Text>
              )}
            </View>

            <View style={styles.cardIcons}>
              <FontAwesome name="cc-visa" size={32} color="#1A1F71" />
              <FontAwesome name="cc-mastercard" size={32} color="#EB001B" />
              <FontAwesome name="cc-discover" size={32} color="#FF6000" />
              <FontAwesome name="cc-paypal" size={32} color="#003087" />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              disabled={submitting}
              onPress={formik.handleSubmit}
            >
              <Icon name="check-circle" size={24} color="white" />
              <Text style={styles.submitButtonText}>Submit Payment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#180161",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#180161",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  bookingDetailsSection: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookingDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bookingTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#180161",
  },
  paymentSection: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  thirdInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardIcons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 16,
  },
  submitButton: {
    backgroundColor: "#180161",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#180161",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  emptyTableContainer: {
    flex: 1, // Allows the container to grow and center its content vertically
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  emptyTableText: {
    fontSize: 16,
    color: "#666",
  },
});
export default ConfirmBooking;
