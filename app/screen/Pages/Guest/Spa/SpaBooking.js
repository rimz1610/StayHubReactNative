import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Carousel from "react-native-reanimated-carousel";
const { width } = Dimensions.get("window");
const ServiceCard = ({ title, description, price }) => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [persons, setPersons] = useState(1);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const adjustPersons = (increment) => {
    setPersons((prevPersons) => {
      const newValue = prevPersons + increment;
      return newValue >= 1 && newValue <= 10 ? newValue : prevPersons;
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.description}>{description}</Text>

        <Text style={styles.label}>Service Date and Time</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <Icon
            name="event"
            size={20}
            color="#180161"
            style={styles.dateIcon}
          />
          <Text style={styles.dateText}>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
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
          <Text style={styles.personCount}>{persons}</Text>
          <TouchableOpacity
            onPress={() => adjustPersons(1)}
            style={styles.personButton}
          >
            <Icon name="add" size={24} color="#180161" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Icon name="spa" size={24} color="white" />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SpaBooking = ({ navigation }) => {
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
  const carouselImages = [
    require("../../../../../assets/images/spa.jpg"),
    require("../../../../../assets/images/spa3.jpg"), // Add more images as needed
    require("../../../../../assets/images/spa2.jpg"),
  ];

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
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />
      </View>
      <View style={styles.tagContainerWrapper}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Luxurious Spa Services</Text>
        </View>
      </View>
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </ScrollView>
  );
};

export default SpaBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
