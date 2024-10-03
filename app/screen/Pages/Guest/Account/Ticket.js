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
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { PDFDocument, rgb } from "pdf-lib";
import { WebView } from "react-native-webview";
import * as Sharing from "expo-sharing";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import CustomLoader from "../../../../components/CustomLoader";

// Separate component for PDF Viewer
const TicketPDFViewer = ({ pdfUri, onClose }) => (
  <View style={styles.modalContainer}>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Icon name="close" size={24} color="black" />
    </TouchableOpacity>
    <WebView
      style={styles.webview}
      source={{ uri: pdfUri }}
      originWhitelist={["*"]}
      useWebKit
    />
  </View>
);

// Reusable component for displaying ticket details
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
  const [pdfUri, setPdfUri] = useState(null);
  const [data, setData] = useState([]);
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

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, bookingId]);

  // Fetch ticket data based on bookingId
  const fetchData = async () => {
    if (bookingId > 0) {
      const token = await AsyncStorage.getItem("token");
      setLoading(true);
      try {
        const response = await axios.get(
          `http://majidalipl-001-site5.gtempurl.com/Ticket/GetTicketList?bookingId=${bookingId}`,
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

  // Function to generate PDF from captured view
  const generateAndSharePDF = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert("Error", "Failed to capture the ticket view.");
        return;
      }

      setLoading(true);

      // Capture the view as an image (PNG format for better quality)
      const uri = await viewShotRef.current.capture();

      // Read the image data as Base64
      const imageBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Embed the image into the PDF
      const pngImage = await pdfDoc.embedPng(imageBase64);
      const pngDims = pngImage.scale(1);

      // Add a page to the PDF with the same dimensions as the image
      const page = pdfDoc.addPage([pngDims.width, pngDims.height]);

      // Draw the image onto the PDF page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngDims.width,
        height: pngDims.height,
      });

      // Serialize the PDFDocument to bytes (base64)
      const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: false });

      // Define the PDF file path
      const pdfPath = `${FileSystem.documentDirectory}ticket.pdf`;

      // Write the PDF file to the device's file system
      await FileSystem.writeAsStringAsync(pdfPath, pdfBytes, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setPdfUri(pdfPath);
      Alert.alert("Success", "PDF created successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  // Function to view the generated PDF
  const viewPDF = () => {
    if (pdfUri) {
      setIsPdfModalVisible(true);
    } else {
      Alert.alert("Error", "Please generate the PDF first.");
    }
  };

  // Function to share/download the PDF
  const sharePDF = async () => {
    if (!pdfUri) {
      Alert.alert("Error", "Please generate the PDF first.");
      return;
    }

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Error", "Sharing is not available on this platform.");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Failed to share PDF.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={generateAndSharePDF}
          >
            <Icon name="picture-as-pdf" size={20} color="white" />
            <Text style={styles.buttonText}>Generate PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={viewPDF}>
            <Icon name="pageview" size={20} color="white" />
            <Text style={styles.buttonText}>View PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={sharePDF}>
            <Icon name="share" size={20} color="white" />
            <Text style={styles.buttonText}>Share PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {/* {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
        {loading && <CustomLoader />}

        {/* Ticket View to Capture */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
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
                <Text style={styles.footerText}>Phone: +1 884-6789-9876</Text>
                <Text style={styles.footerText}>Email: info@stayhub.com</Text>
                <Text style={styles.footerText}>StayHub Hotel & Resort</Text>
                <Text style={styles.footerText}>346 Matangi Road</Text>
                <Text style={styles.footerText}>
                  Albama, 23456, United States
                </Text>
              </View>
            </React.Fragment>
          ))}
        </ViewShot>
      </ScrollView>

      {/* PDF Viewer Modal */}
      <Modal
        visible={isPdfModalVisible}
        onRequestClose={() => setIsPdfModalVisible(false)}
        animationType="slide"
      >
        <TicketPDFViewer
          pdfUri={pdfUri}
          onClose={() => setIsPdfModalVisible(false)}
        />
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
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27496d",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 5,
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  viewShot: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  ticketContainer: {
    backgroundColor: "#27496d",
    marginVertical: 16,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  detailsContainer: {
    alignItems: "center",
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 2,
    paddingHorizontal: 8,
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
  footer: {
    backgroundColor: "#27496d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  webview: {
    flex: 1,
    marginTop: 60,
  },
});

export default Ticket;
