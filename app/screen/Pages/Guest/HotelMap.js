import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HotelMap = ({ navigation }) => {
  // const openGoogleMaps = () => {
  //   const latitude = 37.78825;
  //   const longitude = -122.4324;
  //   const label = "StayHub Hotel & Resort";
  //   const scheme = Platform.select({
  //     ios: "maps:0,0?q=",
  //     android: "geo:0,0?q=",
  //   });
  //   const latLng = `${latitude},${longitude}`;
  //   const url = Platform.select({
  //     ios: `${scheme}${label}@${latLng}`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });
  //   Linking.openURL(url);
  // };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <Image
          source={require("../../../../assets/images/map.jpg")}
          style={styles.mapImage}
        />
        {/* <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={openGoogleMaps}
        >
          <Text style={styles.fullScreenButtonText}>Open in Google Maps</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.hotelName}>StayHub Hotel & Resort</Text>
        <Text style={styles.hotelAddress}>
          123 Paradise Street, Tropical Island
        </Text>

        <View style={styles.amenitiesContainer}>
          <View style={styles.amenityItem}>
            <Ionicons name="restaurant-outline" size={24} color="#180161" />
            <Text style={styles.amenityText}>Restaurant</Text>
          </View>
          <View style={styles.amenityItem}>
            <Ionicons name="fitness-outline" size={24} color="#180161" />
            <Text style={styles.amenityText}>Gym</Text>
          </View>
          <View style={styles.amenityItem}>
            <Ionicons name="water-outline" size={24} color="#180161" />
            <Text style={styles.amenityText}>Spa</Text>
          </View>
          <View style={styles.amenityItem}>
            <Ionicons name="wifi-outline" size={24} color="#180161" />
            <Text style={styles.amenityText}>Free WiFi</Text>
          </View>
        </View>
      </View>

      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="call-outline" size={20} color="white" />
          <Text style={styles.contactButtonText}>Call Hotel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="mail-outline" size={20} color="white" />
          <Text style={styles.contactButtonText}>Email Us</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>
          About StayHub Hotel & Resort
        </Text>
        <Text style={styles.descriptionText}>
          Experience luxury and comfort at StayHub Hotel & Resort. Our prime
          location offers easy access to local attractions, while our
          world-class amenities ensure a memorable stay. Whether you're here for
          business or leisure, our dedicated staff is committed to making your
          visit exceptional.
        </Text>
      </View>
    </ScrollView>
  );
};

export default HotelMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fullScreenButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(24, 1, 97, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fullScreenButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 5,
  },
  hotelAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  amenitiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  amenityItem: {
    alignItems: "center",
    width: "25%",
    marginBottom: 10,
  },
  amenityText: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: "#180161",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  contactButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
  descriptionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180161",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
});
