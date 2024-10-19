import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  getCartFromSecureStore,
  putDataIntoCartAndSaveSecureStore,
  removeDataFromCartAndSaveLocalStorage,
  deleteCartFromSecureStore,
  saveCartToSecureStore,
} from "../../../../components/secureStore";
import moment from "moment";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const BookingItem = ({ type, item, total, onDelete }) => (
  <View style={styles.bookingItem}>
    <View style={styles.bookingMain}>
      <View style={styles.bookingIcon}>
        <Icon name={getIconName(type)} size={24} color="#180161" />
      </View>
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingDetails}>{getDetails(type, item)}</Text>
      </View>
    </View>
    <View style={styles.bookingActions}>
      <Text style={styles.bookingTotal}>${total}</Text>
      <TouchableOpacity
        onPress={() => onDelete(item.index, type)}
        style={styles.deleteButton}
      >
        <Icon name="delete-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  </View>
);

const getIconName = (type) => {
  switch (type) {
    case "R":
      return "hotel";
    case "E":
      return "event";
    case "G":
      return "fitness-center";
    case "S":
      return "spa";
    case "RS":
      return "room-service";
    default:
      return "star";
  }
};

const getDetails = (type, item) => {
  switch (type) {
    case "R":
      const additional =
        item.maxPerson > 0
          ? ` with ${item.maxPerson} additional person(s).`
          : ".";
      return `${item.name} - Check-in: ${moment(item.checkInDate).format(
        "MMM DD YYYY"
      )}
      , Check-out: ${moment(item.checkOutDate).format("MMM DD YYYY")}, Total ${
        item.noofNightStay
      } night(s)${additional}`;

    case "E":
      const aTicket =
        item.adultTickets > 0 ? ` Adult Ticket(s): ${item.adultTickets}` : ".";
      const cTicket =
        item.childTickets > 0
          ? item.adultTickets > 0
            ? `, `
            : "" + ` Child Ticket(s): ${item.childTickets}`
          : "";
      return `${item.name} - ${aTicket}${cTicket}`;
    case "G":
      return `${item.name}, Month: ${item.monthRange}`;
    case "S":
      return `${item.name}, Total Persons:  ${item.noOfPersons}, Date ${moment(
        item.spaDate
      ).format("MM/DD/YYYY")}, Timing ${item.time}`;
    case "RS":
      return `${item.roomName}, Service Request:  ${
        item.serviceName
      }, Request Date: ${moment(item.requestDate).format(
        "MM/DD/YYYY hh:mm A"
      )}`;
    default:
      return "";
  }
};

const BookingItems = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [cart, setCartModel] = useState({
    bookingModel: {
      id: 0,
      referenceNumber: " ",
      bookingAmount: 0,
      bookingDate: new Date(),
      paidAmount: 0,
      status: "UnPaid",
      notes: " ",
      guestId: 0,
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
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      FillItems();
    }
  }, [isFocused]);
  const   FillItems = async () => {
    setLoading(true);
    try {
      setCartModel(await getCartFromSecureStore());

      calculateTotal();
    } catch (error) {
      Alert.alert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(0);
  const [itemType, setItemType] = useState("");
  const calculateTotal = async () => {
    const data = await getCartFromSecureStore();
    if (data != null)
      try {
        const response = await axios.post(
          "http://tehreemimran-001-site1.htempurl.com/Cart/CalculateCartItems",
          data
        );

        if (response.data.success) {
          const updatedCart = await getCartFromSecureStore();
          updatedCart.bookingModel.bookingAmount =
            response.data.data.totalPrice;
          updatedCart.bookingModel.paidAmount = response.data.data.totalPrice;
          setCartModel({ ...updatedCart });
          await saveCartToSecureStore(updatedCart);
        } else {
          Alert.alert("Error", "Unable");
          setErrorMessages(response.data.message);
        }
      } catch (error) {
        const errorMessage = error.message || "Unknown error";
        Alert.alert("Error", errorMessage);
      } finally {
      }
  };

  const handleDelete = (id, type) => {
    setItemToDelete(id);
    setItemType(type);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    removeDataFromCartAndSaveLocalStorage(itemToDelete, itemType);
    FillItems();
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("RoomBooking")}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Booking Items</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bookingSection}>
            {cart != null &&
            (cart.lstEvent?.length > 0 ||
              cart.lstRoom?.length > 0 ||
              cart.lstRoomService?.length > 0 ||
              cart.lstGym?.length > 0 ||
              cart.lstSpa?.length > 0) ? (
              <>
                <View style={styles.bookingList}>
                  {cart.lstRoom?.map((item, index) => (
                    <BookingItem
                      key={item.roomId + "room" + index}
                      type={"R"}
                      total={item.itemTotalPrice}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))}

                  {cart.lstRoomService?.map((item, index) => (
                    <BookingItem
                      key={item.roomId + "room service" + index}
                      type={"RS"}
                      total={item.price}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))}

                  {cart.lstEvent?.map((item, index) => (
                    <BookingItem
                      key={item.eventId + "event" + index}
                      type={"E"}
                      total={item.itemTotalPrice}
                      item={item}
                      onDelete={handleDelete}
                    />
                  ))}

                  {cart.lstGym?.map((item, index) => (
                    <BookingItem
                      key={item.gymId + "gym" + index}
                      type={"G"}
                      item={item}
                      total={item.price}
                      onDelete={handleDelete}
                    />
                  ))}

                  {cart.lstSpa?.map((item, index) => (
                    <BookingItem
                      key={item.spaId + "spa" + index}
                      type={"S"}
                      item={item}
                      total={item.price}
                      onDelete={handleDelete}
                    />
                  ))}
                </View>

                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>
                    ${cart.bookingModel.bookingAmount}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={() => navigation.navigate("ConfirmBooking")}
                >
                  <Icon name="credit-card" size={24} color="white" />
                  <Text style={styles.proceedButtonText}>Proceed To Pay</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.containerEmpty}>
                <Icon name="shopping-cart" size={100} color="#ccc" />
                <Text style={styles.titleEmpty}>
                  Your booking cart is empty
                </Text>
                <Text style={styles.subtitleEmpty}>
                  Add some exciting items to get started!
                </Text>
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate("RoomBooking")}
                >
                  <Text style={styles.exploreButtonText}>Explore Services</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#180161",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
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
    marginTop: 20,
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
  containerEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  titleEmpty: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleEmpty: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#180161",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default BookingItems;
