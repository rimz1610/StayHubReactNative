import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ConfirmBooking = ({ navigation, route }) => {
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  const [bookings, setBookings] = useState([
    { name: "Deluxe Room", details: "2 nights, Ocean View", totalItem: 300 },
    {
      name: "Event Booking",
      details: "Conference Room A, 1 day",
      totalItem: 200,
    },
    { name: "Gym Access", details: "2 days pass", totalItem: 40 },
    {
      name: "Spa Treatment",
      details: "Full Body Massage, 60 mins",
      totalItem: 120,
    },
    { name: "Room Service", details: "Cleaning, 2 times", totalItem: 50 },
  ]);

  const handleConfirmPayment = () => {
    console.log("Payment Submitted");
  };

  const handleDeleteBooking = (index) => {
    setBookings(bookings.filter((_, i) => i !== index));
  };

  const totalAmount = bookings.reduce(
    (sum, booking) => sum + booking.totalItem,
    0
  );

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
            {bookings.map((booking, index) => (
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
            ))}
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>Total Amount:</Text>
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
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
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />

            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.thirdInput]}
                placeholder="MM"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={expiryMonth}
                onChangeText={setExpiryMonth}
              />
              <TextInput
                style={[styles.input, styles.thirdInput]}
                placeholder="YY"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={expiryYear}
                onChangeText={setExpiryYear}
              />
              <TextInput
                style={[styles.input, styles.thirdInput]}
                placeholder="CVV"
                placeholderTextColor="#888"
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
            </View>

            <View style={styles.cardIcons}>
              <FontAwesome name="cc-visa" size={32} color="#1A1F71" />
              <FontAwesome name="cc-mastercard" size={32} color="#EB001B" />
              <FontAwesome name="cc-discover" size={32} color="#FF6000" />
              <FontAwesome name="cc-paypal" size={32} color="#003087" />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleConfirmPayment}
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
});

export default ConfirmBooking;
