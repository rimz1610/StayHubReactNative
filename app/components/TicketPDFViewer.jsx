// TicketPDFViewer.js

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { WebView } from "react-native-webview";

const TicketPDFViewer = ({ pdfUri, onClose }) => (
  <View style={styles.container}>
    {/* Close Button */}
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Icon name="close" size={30} color="black" />
    </TouchableOpacity>

    {/* PDF Viewer */}
    <WebView
      source={{ uri: pdfUri }}
      style={styles.webview}
      originWhitelist={["*"]}
      useWebKit
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  webview: {
    flex: 1,
    marginTop: 80,
  },
});

export default TicketPDFViewer;
