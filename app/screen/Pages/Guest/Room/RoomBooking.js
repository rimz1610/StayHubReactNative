import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import { Calendar } from "react-native-calendars";
import { differenceInDays, format } from "date-fns";
import RNPickerSelect from "react-native-picker-select";
import { useIsFocused } from "@react-navigation/native";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveCartToSecureStore,
  getCartFromSecureStore,
  validateDatesFromSecureStore,
} from "../../../../components/secureStore";
import { CARTMODEL } from "../../../constant";

const filterSchema = Yup.object().shape({
  roomType: Yup.string().notRequired(),
  checkInDate: Yup.date().required("Required"),
  checkOutDate: Yup.date().required("Required"),
  noOfAdditionalPerson: Yup.number().required("Required"),
});
const RoomBooking = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [nights, setNights] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const isFocused = useIsFocused();
  const [submitting, setSubmitting] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(0);
  const [roomDetail, setRoomDetail] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const [isValid, setIsValid] = useState(true);

  const [bookRoomModel, setBookRoomModel] = useState({
    roomId: 0,
    checkInDate: new Date(),
    checkOutDate: new Date(),
    itemTotalPrice: 0,
    index: 0,
    name: "",
    maxPerson: 0,
    noofNightStay: 0,
  });

  const formik = useFormik({
    initialValues: {
      roomType: "",
      noOfAdditionalPerson: 0,
      checkInDate: new Date(),
      checkOutDate: new Date(),
    },
    validationSchema: filterSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          "http://majidalipl-001-site5.gtempurl.com/Room/GetRoomsByFilter",
          values
        );

        if (response.data.success) {
          setData(response.data.list);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while rooms.");
      } finally {
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    if (isFocused) {
      formik.resetForm();
      setData([]);
    }
  }, [isFocused]);

  handleShowRoomDetails = (roomId) => {
    setCurrentRoomId(roomId);
    fetchRoomData();
  };

  // handleAddToBooking = async (item) => {
  //   console.log("Inside Handle Booking");
  //   setBookRoomModel({
  //     roomId: item.id,
  //     checkInDate: formik.values.checkInDate,
  //     checkOutDate: formik.values.checkOutDate,
  //     itemTotalPrice: item.price,
  //     index: 0,
  //     name: item.name,
  //     maxPerson: formik.values.noOfAdditionalPerson,
  //     noofNightStay: nights,
  //   });
  //   const token = await AsyncStorage.getItem("token");
  //   if (token == null) {
  //     navigation.navigate("Login");
  //   }
  //   if (bookSpaModel.price == 0) {
  //     Alert.alert("Oops", "Please select spa");
  //   }
  //   try {
  //     const response = await validateDatesFromSecureStore(
  //       item.id,
  //       formik.values.checkInDate,
  //       formik.values.checkOutDate
  //     );
  //     if (!response) {
  //       setIsValid(true);
  //       setErrorMessages("");
  //       Alert.alert(
  //         "Confirm",
  //         "Are you sure you want to continue?",
  //         [
  //           {
  //             text: "Cancel",
  //             onPress: () => {},
  //             style: "cancel",
  //           },
  //           {
  //             text: "Yes",
  //             onPress: async () => {
  //               if ((await getCartFromSecureStore()) == null) {
  //                 console.log("Cart was empty");
  //                 const guestId = await AsyncStorage.getItem("loginId");
  //                 console.warn(guestId);
  //                 await saveCartToSecureStore({
  //                   bookingModel: {
  //                     id: 0,
  //                     referenceNumber: " ",
  //                     bookingAmount: 0,
  //                     bookingDate: new Date(),
  //                     paidAmount: 0,
  //                     status: "UnPaid",
  //                     notes: " ",
  //                     guestId: guestId,
  //                   },
  //                   paymentDetail: {
  //                     paidAmount: 0,
  //                     bookingId: 0,
  //                     cardNumber: "4242424242424242",
  //                     nameOnCard: "Test",
  //                     expiryYear: "2025",
  //                     expiryMonth: "01",
  //                     cVV: "123",
  //                     transactionId: " ",
  //                   },
  //                   lstRoom: [],
  //                   lstRoomService: [],
  //                   lstGym: [],
  //                   lstSpa: [],
  //                   lstEvent: [],
  //                 });
  //               }
  //               const cart = await getCartFromSecureStore();
  //               const index =
  //                 cart.lstRoom != null && cart.lstRoom.length > 0
  //                   ? cart.lstRoom.length + 1
  //                   : 1;
  //               console.warn(cart.lstRoom);
  //               setBookRoomModel({ ...bookRoomModel, index: index });
  //               const updatedCart = { ...cart };
  //               if (
  //                 updatedCart.lstRoom == undefined ||
  //                 updatedCart.lstRoom == null ||
  //                 updatedCart.lstRoom.length == 0
  //               ) {
  //                 updatedCart.lstRoom = [];
  //               }
  //               updatedCart.lstRoom.push({ ...bookRoomModel, index: index });
  //               await saveCartToSecureStore(updatedCart);
  //               console.warn(await getCartFromSecureStore());
  //               navigation.navigate("Cart");
  //             },
  //           },
  //         ],
  //         { cancelable: false }
  //       );
  //     } else {
  //       setIsValid(false);
  //       setErrorMessages(response.data.message);
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //     Alert.alert("Error", "An error occurred while validating capacity.");
  //   } finally {
  //   }
  // };

  const handleAddToBooking = async (item) => {
    console.log("Inside Handle Booking");
    setBookRoomModel({
      roomId: item.id,
      checkInDate: formik.values.checkInDate,
      checkOutDate: formik.values.checkOutDate,
      itemTotalPrice: item.price,
      index: 0,
      name: item.name,
      maxPerson: formik.values.noOfAdditionalPerson,
      noofNightStay: nights,
    });

    const token = await AsyncStorage.getItem("token");
    if (token == null) {
      navigation.navigate("Login");
      return;
    }

    // if (bookSpaModel.price == 0) {
    //   Alert.alert("Oops", "Please select spa");
    //   return;
    // }

    try {
      const datesAreValid = await validateDatesFromSecureStore(
        item.id,
        formik.values.checkInDate,
        formik.values.checkOutDate
      );

      if (!datesAreValid) {
        setIsValid(false);
        setErrorMessages(
          "The selected dates conflict with an existing booking for this room."
        );
        Alert.alert(
          "Error",
          "The selected dates are not available for this room."
        );
        return;
      }

      setIsValid(true);
      setErrorMessages("");

      Alert.alert(
        "Confirm",
        "Are you sure you want to continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              let cart = await getCartFromSecureStore();
              if (!cart) {
                console.log("Cart was empty");
                const guestId = await AsyncStorage.getItem("loginId");
                console.warn(guestId);
                cart = {
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
                    paidAmount: 0,
                    bookingId: 0,
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
                };
              }

              const index = cart.lstRoom ? cart.lstRoom.length + 1 : 1;
              const updatedBookRoomModel = { ...bookRoomModel, index: index };

              cart.lstRoom = cart.lstRoom || [];
              cart.lstRoom.push(updatedBookRoomModel);

              await saveCartToSecureStore(cart);
              console.warn(await getCartFromSecureStore());
              navigation.navigate("Cart");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error in handleAddToBooking:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    }
  };
  const fetchRoomData = async () => {
    if (currentRoomId > 0) {
      try {
        const response = await axios.get(
          `http://majidalipl-001-site5.gtempurl.com/Room/GetRoomById?id=${currentRoomId}`
        );
        if (response.data.success) {
          setRoomDetail(response.data.data);
          console.warn(response.data.data);
          setShowDetails(true);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch room details");
      }
    }
  };

  const handleDateSelect = (date) => {
    if (
      !formik.values.checkInDate ||
      (formik.values.checkInDate && formik.values.checkOutDate)
    ) {
      formik.setFieldValue("checkInDate", date.dateString);
      formik.setFieldValue("checkOutDate", null);
    } else {
      formik.setFieldValue("checkOutDate", date.dateString);
      const nights = differenceInDays(
        new Date(date.dateString),
        new Date(formik.values.checkInDate)
      );
      setNights(nights);
    }
  };

  const getMarkedDates = () => {
    if (!formik.values.checkInDate) return {};

    const markedDates = {
      [formik.values.checkInDate]: {
        startingDay: true,
        color: "#180161",
        textColor: "white",
      },
    };

    if (formik.values.checkOutDate) {
      markedDates[formik.values.checkOutDate] = {
        endingDay: true,
        color: "#180161",
        textColor: "white",
      };

      let currentDate = new Date(formik.values.checkInDate);
      const end = new Date(formik.values.checkOutDate);
      while (currentDate < end) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = format(currentDate, "yyyy-MM-dd");
        if (dateString !== formik.values.checkOutDate) {
          markedDates[dateString] = { color: "#180161", textColor: "white" };
        }
      }
    }

    return markedDates;
  };
  const [carouselImages, setCarouselImages] = useState([
    {
      uri: require("../../../../../assets/images/room-one.jpg"),
      loaded: false,
    },
    {
      uri: require("../../../../../assets/images/room-two.jpg"),
      loaded: false,
    },
    {
      uri: require("../../../../../assets/images/room-three.jpg"),
      loaded: false,
    },
  ]);
  // const placeholderImage = { uri: "https://via.placeholder.com/300x150" };
  // const renderCarouselItem = ({ item }) => (
  //   <Image
  //     style={styles.carouselImage}
  //     source={item}
  //     placeholder={placeholderImage}
  //     contentFit="cover"
  //     transition={1000}
  //   />
  // );
  const renderRoomItem = (item) => (
    <View style={styles.roomItem}>
      <Image
        source={{ uri: item.roomImageUrl }}
        style={styles.roomImage}
        placeholder={placeholderImage}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.roomType}>{item.roomType}</Text>
        <Text style={styles.roomPrice}>
          {item.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleShowRoomDetails(item.roomId)}
            style={styles.viewDetails}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAddToBooking(item)}
            style={styles.bookingButton}
          >
            <Ionicons name="calendar" size={17} color="#fff" />
            <Text style={styles.bookingButtonText}>Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const ImageGridItem = ({ image, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.imageContainer}>
      <Image
        source={{ uri: image.imageUrl }}
        style={styles.gridImage}
        placeholder={placeholderImage}
        contentFit="cover"
        transition={1000}
      />
    </TouchableOpacity>
  );
  const handleImagePress = (image) => {
    setSelectedImage(image);
    setShowDetails(false);
  };

  const additionalPersonOptions = Array.from({ length: 10 }, (_, i) => ({
    label: i.toString(),
    value: i,
  }));

  const roomTypeOptions = [
    "",
    "Single",
    "Double",
    "Triple",
    "Twin",
    "King",
    "Queen",
    "Suite",
    "Studio",
  ].map((type) => {
    return {
      label: type === "" ? "All" : type,
      value: type,
    };
  });
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
          <Text style={styles.tagText}>Room Services</Text>
        </View>
      </View>
      <View style={styles.dateSection}>
        <Text style={styles.sectionLabel}>Select Your Stay Dates</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.datePickerButtonText}>
            {formik.values.checkInDate && formik.values.checkOutDate
              ? `${format(
                  new Date(formik.values.checkInDate),
                  "MMM dd, yyyy"
                )} - ${format(
                  new Date(formik.values.checkOutDate),
                  "MMM dd, yyyy"
                )}`
              : "Select dates"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.calendarModalView}>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            markingType={"period"}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#180161",
              selectedDayBackgroundColor: "#180161",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#180161",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#180161",
              selectedDotColor: "#ffffff",
              arrowColor: "#180161",
              monthTextColor: "#180161",
              indicatorColor: "#180161",
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCalendar(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.stayInfo}>
        <Text style={styles.stayInfoText}>
          Check-in:{" "}
          {formik.values.checkInDate
            ? format(new Date(formik.values.checkInDate), "MMM dd, yyyy")
            : "Not selected"}
        </Text>
        <Text style={styles.stayInfoText}>
          Check-out:{" "}
          {formik.values.checkOutDate
            ? format(new Date(formik.values.checkOutDate), "MMM dd, yyyy")
            : "Not selected"}
        </Text>
        <Text style={styles.stayInfoText}>Number of Nights: {nights}</Text>
        {formik.touched.checkInDate && formik.errors.checkInDate && (
          <Text style={styles.errorText}>{formik.errors.checkInDate}</Text>
        )}
        {formik.touched.checkOutDate && formik.errors.checkOutDate && (
          <Text style={styles.errorText}>{formik.errors.checkOutDate}</Text>
        )}
      </View>

      <View style={styles.filterSection}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Additional Person</Text>
            <RNPickerSelect
              onValueChange={(value) =>
                formik.setFieldValue("noOfAdditionalPerson", value)
              }
              items={additionalPersonOptions}
              style={pickerSelectStyles}
              value={formik.values.noOfAdditionalPerson}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color="#180161"
                  style={styles.iconStyle}
                />
              )}
            />
          </View>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Room Type</Text>
            <RNPickerSelect
              onValueChange={(value) => formik.setFieldValue("roomType", value)}
              items={roomTypeOptions}
              style={pickerSelectStyles}
              value={formik.values.roomType}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color="#180161"
                  style={styles.iconStyle}
                />
              )}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={formik.handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#ffff" />
          ) : (
            <>
              <Ionicons name="filter" size={24} color="#fff" />
              <Text style={styles.filterButtonText}>Filter</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.availableRoomsHeading}>Available Rooms</Text>
      {submitting ? (
        <ActivityIndicator size="large" color="#180161" />
      ) : data.length === 0 ? (
        <View style={styles.noRoomContainer}>
          <Text style={styles.noRoom}>No rooms are available</Text>
        </View>
      ) : (
        data != undefined &&
        data.map((room, index) => {
          return <View key={index}>{renderRoomItem(room)}</View>;
        })
      )}
      {/* {renderRoomItem("Cozy Suite", "Deluxe", 150, RoomImage)}
      {renderRoomItem("Ocean View", "Suite", 250, RoomImage1)}
      {renderRoomItem("Standard Room", "Standard", 100, RoomImage2)}
      {renderRoomItem("Family Room", "Deluxe", 200, RoomImage3)} */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetails}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Room Details</Text>
          <Text style={styles.modalText}>{roomDetail.name}</Text>
          <View style={styles.bulletPointContainer}>
            <Text style={styles.bulletPoint}>{roomDetail.type}</Text>
            <Text style={styles.bulletPoint}>
              {roomDetail.shortDescription}
            </Text>
            <Text>{roomDetail.description}</Text>
            {/* <Text style={styles.bulletPoint}>• 2 Bedside Tables</Text>
            <Text style={styles.bulletPoint}>• A Desk & Chair</Text>
            <Text style={styles.bulletPoint}>• Wall-to-wall carpeting</Text>
            <Text style={styles.bulletPoint}>• Trendy furnishings</Text>
            <Text style={styles.bulletPoint}>• A balcony</Text>
            <Text style={styles.bulletPoint}>
              • Ultramodern glass bathroom equipped with:
            </Text>
            <Text style={styles.bulletSubPoint}>- Hairdryer</Text>
            <Text style={styles.bulletSubPoint}>
              - Magnifying shaving and make-up mirror
            </Text>
            <Text style={styles.bulletSubPoint}>
              - All the amenities you could possibly need during your stay
            </Text> */}
          </View>

          <View style={styles.imageGrid}>
            {roomDetail.imagesUrl != undefined &&
              roomDetail.imagesUrl.map((image, index) => (
                <ImageGridItem
                  key={index}
                  image={image}
                  onPress={() => handleImagePress(image.imageUrl)}
                />
              ))}
            {/* {[RoomImage1, RoomImage2, RoomImage3].map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(image)}
                style={styles.imageContainer}
              >
                <Image source={image} style={styles.gridImage} />
              </TouchableOpacity>
            ))} */}
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetails(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.fullScreenImageContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
            placeholder={placeholderImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeFullScreenButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  carouselContainer: {
    width: width,
    height: width * 0.7,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  hiddenImage: {
    opacity: 0,
  },
  placeholderImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageContainer: {
    position: "relative",
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
  dateSection: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#180161",
  },
  datePickerButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#180161",
    fontWeight: "600",
  },
  calendarModalView: {
    backgroundColor: "white",
    margin: 20,
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
  closeButton: {
    backgroundColor: "#180161",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  stayInfo: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  stayInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  availableRoomsHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 20,
    color: "#180161",
  },
  roomItem: {
    flexDirection: "row",
    marginBottom: 15,
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  roomImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10,
  },
  roomInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
  },
  roomType: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
  },
  viewDetails: {
    padding: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#180161",
  },
  viewDetailsText: {
    color: "#180161",
    fontSize: 12,
    fontWeight: "bold",
  },
  bookingButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#180161",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 12,
  },
  modalView: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -width * 0.4 }, { translateY: -height * 0.4 }],
    width: width * 0.8,
    maxHeight: height * 0.8,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#180161",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  bulletPointContainer: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  bulletSubPoint: {
    fontSize: 14,
    color: "#333",
    marginLeft: 15,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: 80,
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  fullScreenImage: {
    width: width * 0.9,
    height: height * 0.9,
    resizeMode: "contain",
    borderRadius: 10,
  },
  closeFullScreenButton: {
    marginBottom: 50,
    backgroundColor: "#180161",
    padding: 10,
    borderRadius: 5,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickerWrapper: {
    width: "48%",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  position: "absolute",
  top: "50%",
  right: 12,
  transform: [{ translateY: -12 }],

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#180161",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
  },
  noRoomContainer: {
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  noRoom: {
    color: "#180161",
    fontWeight: "500",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#180161",
    paddingRight: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#180161",
    paddingRight: 30,
    backgroundColor: "#fff",
    elevation: 2,
  },
  iconContainer: {
    top: Platform.OS === "ios" ? 5 : 12,
    right: 12,
    transform: [{ translateY: 3 }],
  },
});

export default RoomBooking;
