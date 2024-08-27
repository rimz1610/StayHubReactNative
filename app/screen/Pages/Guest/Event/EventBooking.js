import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/FontAwesome";

const EventBooking = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);

  const adultTicketPrice = 50;
  const childTicketPrice = 30;

  const options = [
    { label: "Event 1 - 01/09/2024", value: "event1-2024-09-01" },
    { label: "Event 2 - 05/09/2024", value: "event2-2024-09-05" },
    { label: "Event 3 - 10/09/2024", value: "event3-2024-09-10" },
  ];

  const handleSelectionChange = (value) => {
    if (value) {
      const [event, year, month, day] = value.split("-");
      setSelectedEvent(event);
      setSelectedDate(`${day}/${month}/${year}`);
    } else {
      setSelectedEvent(null);
      setSelectedDate(null);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    console.log("Formatted Date:", `${day}/${month}/${year}`); // Debugging line
    return `${day}/${month}/${year}`;
  };

  const renderEventDetails = () => {
    if (!selectedEvent || !selectedDate) return null;

    const finalAmount =
      adultTickets * adultTicketPrice + childTickets * childTicketPrice;

    return (
      <View style={styles.eventContainer}>
        <Text style={styles.eventTitle}>Event: {selectedEvent}</Text>
        <Text style={styles.eventDate}>Date: {selectedDate}</Text>
        <Image
          style={styles.eventImage}
          source={{ uri: "https://via.placeholder.com/300x150" }}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>Details</Text>
          <Text style={styles.description}>
            This is a dummy description of the selected event. It provides a
            brief overview of what the event is about.
          </Text>
        </View>
        <View style={styles.termsContainer}>
          <Text style={styles.heading}>Terms and Conditions</Text>
          <Text style={styles.bullet}>• No refunds available.</Text>
          <Text style={styles.bullet}>• Must present a valid ID.</Text>
          <Text style={styles.bullet}>
            • Event starts at the specified time.
          </Text>
        </View>
        <View style={styles.ticketContainer}>
          <Text style={styles.ticketLabel}>No of Adult Tickets:</Text>
          <TextInput
            style={styles.ticketInput}
            keyboardType="numeric"
            value={String(adultTickets)}
            onChangeText={(value) => setAdultTickets(parseInt(value) || 0)}
          />
          <Text style={styles.ticketPrice}>${adultTicketPrice} per adult</Text>
        </View>
        <View style={styles.ticketContainer}>
          <Text style={styles.ticketLabel}>No of Child Tickets:</Text>
          <TextInput
            style={styles.ticketInput}
            keyboardType="numeric"
            value={String(childTickets)}
            onChangeText={(value) => setChildTickets(parseInt(value) || 0)}
          />
          <Text style={styles.ticketPrice}>${childTicketPrice} per child</Text>
        </View>
        <Text style={styles.finalAmount}>Final Amount: ${finalAmount}</Text>
        <TouchableOpacity style={styles.button}>
          <Icon name="check" size={16} color="#fff" />
          <Text style={styles.buttonText}>Add To Booking</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Event and Date</Text>
        <RNPickerSelect
          onValueChange={handleSelectionChange}
          items={options}
          placeholder={{ label: "Select Event and Date", value: null }}
          style={pickerSelectStyles}
        />
      </View>
      {renderEventDetails()}
    </ScrollView>
  );
};

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
