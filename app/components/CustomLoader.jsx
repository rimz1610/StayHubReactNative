import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Lottie from "lottie-react-native";

const CustomLoader = () => {
  return (
    <View style={styles.container}>
      <Lottie
        source={require("../../assets/images/Animation - 1727200700135.json")} // Replace with your animation file
        autoPlay
        loop
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#e6e6e6", // Optional: set a background color
  },
  loader: {
    width: 120, // Adjust size as needed
    height: 100,
  },
});

export default CustomLoader;
