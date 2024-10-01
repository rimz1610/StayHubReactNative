import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const TicketPDFViewer = ({ pdfUrl }) => {
  // Google Docs viewer URL
  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    pdfUrl
  )}`;

  return (
    <WebView
      source={{ uri: googleDocsUrl }}
      style={styles.webview}
      startInLoadingState={true}
      scalesPageToFit={true}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default TicketPDFViewer;
