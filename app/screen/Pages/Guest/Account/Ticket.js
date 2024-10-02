import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  // pdfUrl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import moment from "moment";
import axios from "axios";
import {
  PDFDocument,
  Page,
  Image as PDFImage,
  StyleSheet as PDFStyleSheet,
} from "react-native-pdf-lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import TicketPDFViewer from "../../../../components/TicketPDFViewer";
const TicketDetail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const Ticket = ({ route, navigation }) => {
  const viewShotRef = useRef();
  const bookingId = route.params?.bookingId || 0;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const ticket = {
    id: 0,
    bookingDate: "",
    refNo: "",
    eventName: "",
    firstName: "",
    lastName: "",
    ticket: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketNumber: "",
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, bookingId]);

  // Function to refetch the updated room list
  const fetchData = async () => {
    if (bookingId > 0) {
      const token = await AsyncStorage.getItem("token");

      setLoading(true);
      try {
        const response = await axios.get(
          "http://majidalipl-001-site5.gtempurl.com/Ticket/GetTicketList?bookingId=" +
            bookingId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setData(response.data.list);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to login page
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "Failed to fetch ticket details.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Sample data - replace with actual data in a real app
  const ticketData = {
    invoiceDate: "17 Aug 2024",
    bookingPerson: "Fatima Zuhra",
    bookingRef: "STH-00066",
    eventName: "Opera - 23 Sept",
    eventDate: "Thu 12 September 2024",
    timings: "09:00AM-05:00PM",
    ticketType: "Child",
    serialNo: "04020",
  };

  const hotelData = {
    phone: "+1 884-6789-9876",
    email: "info@stayhub.com",
    name: "StayHub Hotel & Resort",
    address: "346 Matangi Road",
    city: "Albama, 23456, United States",
  };
  const generateAndSharePDF = async () => {
    try {
      // Ensure the view is rendered before capture
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the current screen view
      const uri = await viewShotRef.current.capture();

      // Create a PDF and add the captured image
      const pdfPath = `${FileSystem.documentDirectory}ticket.pdf`;
      const page = PDFDocument.create(pdfPath)
        .addPages([
          Page.create()
            .setMediaBox(600, 800) // Adjust the page size as necessary
            .drawImage(PDFImage.create(uri).fitToBox(600, 800)),
        ])
        .write();

      // Check if sharing is available, and share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfPath);
      } else {
        Alert.alert("Sharing not available");
      }

      setPdfUrl(pdfPath);
    } catch (error) {
      console.error("Error generating and sharing PDF:", error);
      Alert.alert("Error", "Failed to generate and share PDF.");
    }
  };
  const viewPDF = () => {
    if (pdfUrl) {
      console.log("PDF URL:", pdfUrl); // Debugging
      setIsPdfModalVisible(true);
    } else {
      Alert.alert("Error", "Please generate the PDF first.");
    }
  };

  // const hotelData = {
  //   phone: "+1 884-6789-9876",
  //   email: "info@stayhub.com",
  //   name: "StayHub Hotel & Resort",
  //   address: "346 Matangi Road",
  //   city: "Albama, 23456, United States",
  // };
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access media library is required!");
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("BookingReceipt")}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Tickets</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView>
        <TouchableOpacity style={styles.button} onPress={generateAndSharePDF}>
          <Icon name="picture-as-pdf" size={20} color="white" />
          <Text style={styles.buttonText}>Generate and Share PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={viewPDF}>
          <Icon name="pageview" size={20} color="white" />
          <Text style={styles.buttonText}>View PDF</Text>
        </TouchableOpacity>

        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
          style={styles.viewShot}
        >
          {data.map((ticketItem, index) => (
            <React.Fragment key={index}>
              <View style={styles.ticketContainer}>
                <Image
                  source={require("../../../../../assets/images/samplelogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.detailsContainer}>
                  <TicketDetail
                    label="Invoice Date"
                    value={ticketItem.bookingDate}
                  />
                  <TicketDetail
                    label="Booking Person"
                    value={`${ticketItem.firstName} ${ticketItem.lastName}`}
                  />
                  <TicketDetail
                    label="Booking Ref #"
                    value={ticketItem.refNo}
                  />
                  <TicketDetail label="Event" value={ticketItem.eventName} />
                  <TicketDetail label="Date" value={ticketItem.eventDate} />
                  <TicketDetail label="Time" value={ticketItem.eventTime} />
                  <TicketDetail label="Ticket" value={ticketItem.ticket} />
                  <TicketDetail
                    label="Serial #"
                    value={ticketItem.ticketNumber}
                  />
                  <TicketDetail label="Location" value={ticketItem.location} />
                </View>
              </View>
              <View style={styles.footer}>
                <Text style={styles.footerText}>{hotelData.phone}</Text>
                <Text style={styles.footerText}>{hotelData.email}</Text>
                <Text style={styles.footerText}>{hotelData.name}</Text>
                <Text style={styles.footerText}>{hotelData.address}</Text>
                <Text style={styles.footerText}>{hotelData.city}</Text>
              </View>
            </React.Fragment>
          ))}
        </ViewShot>
      </ScrollView>
      <Modal
        visible={isPdfModalVisible}
        onRequestClose={() => setIsPdfModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsPdfModalVisible(false)}
          >
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          {pdfUrl && <TicketPDFViewer pdfUrl={pdfUrl} />}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#180161",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  viewShot: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
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
  downloadButton: {
    width: "50%",
    backgroundColor: "#27496d",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 14,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 8,
  },
  ticketContainer: {
    backgroundColor: "#27496d",
    margin: 16,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  detailsContainer: {
    alignItems: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#fff",
    flex: 2,
    textAlign: "right",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27496d",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default Ticket;
