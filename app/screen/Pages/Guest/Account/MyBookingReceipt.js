import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

const MyBookingReceipt = ({ route, navigation }) => {
  const [selectedReceipt, setSelectedReceipt] = useState("BookingReceipt");
  const navigation = useNavigation();
  const bookingId = route.params?.id || 0;

  const handleNavigation = () => {
    if (selectedReceipt === "BookingReceipt") {
      navigation.navigate("BookingReceipt", {id:bookingId});
    } else {
      navigation.navigate("Ticket");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Download Receipt</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedReceipt(value)}
          value={selectedReceipt}
          items={[
            { label: "Booking Receipt", value: "BookingReceipt" },
            { label: "Ticket Receipt", value: "Ticket" },
          ]}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleNavigation}
      >
        <Text style={styles.downloadButtonText}>Go to {selectedReceipt}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MyBookingReceipt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    fontSize: 16,
    padding: 10,
    color: "#180161",
  },
  downloadButton: {
    backgroundColor: "#180161",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
