import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const BookingItem = ({ item, onDelete }) => (
  <View style={styles.bookingItem}>
    <View style={styles.bookingMain}>
      <View style={styles.bookingIcon}>
        <Icon name={getIconName(item.type)} size={24} color="#180161" />
      </View>
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingName}>{item.name}</Text>
        <Text style={styles.bookingDetails}>{item.details}</Text>
      </View>
    </View>
    <View style={styles.bookingActions}>
      <Text style={styles.bookingTotal}>${item.total.toFixed(2)}</Text>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
      >
        <Icon name="delete-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  </View>
);

const getIconName = (type) => {
  switch (type.toLowerCase()) {
    case "room":
      return "hotel";
    case "event":
      return "event";
    case "gym":
      return "fitness-center";
    case "spa":
      return "spa";
    case "room service":
      return "room-service";
    default:
      return "star";
  }
};

const BookingItems = ({ navigation }) => {
  const [bookings, setBookings] = useState([
    {
      id: "1",
      type: "Room",
      name: "Deluxe Ocean View",
      details: "2 nights, King bed, Balcony",
      total: 600,
    },
    {
      id: "2",
      type: "Event",
      name: "Beach Wedding Package",
      details: "Ceremony setup, 50 guests",
      total: 3000,
    },
    {
      id: "3",
      type: "Gym",
      name: "Fitness Center Access",
      details: "Unlimited access, 7 days",
      total: 100,
    },
    {
      id: "4",
      type: "Spa",
      name: "Body Massage",
      details: "90 minutes, Aromatherapy",
      total: 250,
    },
    {
      id: "5",
      type: "Room Service",
      name: "In-Room Dining",
      details: "Breakfast for two, 2 days",
      total: 120,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const calculateTotal = () => {
    return bookings.reduce((sum, item) => sum + item.total, 0);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    setBookings(bookings.filter((item) => item.id !== itemToDelete));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#180161" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Booking Items</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bookingSection}>
            <View style={styles.bookingList}>
              {bookings.map((item) => (
                <BookingItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </View>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => navigation.navigate("ConfirmBooking")}
          >
            <Icon name="credit-card" size={24} color="white" />
            <Text style={styles.proceedButtonText}>Proceed To Pay</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Remove this item from your booking?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  bookingSection: {
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
  bookingList: {
    marginBottom: 16,
  },
  bookingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  bookingMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  bookingDetails: {
    fontSize: 14,
    color: "#666",
  },
  bookingActions: {
    alignItems: "flex-end",
  },
  bookingTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#180161",
  },
  proceedButton: {
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
  proceedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "#999",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#FF6B6B",
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default BookingItems;
