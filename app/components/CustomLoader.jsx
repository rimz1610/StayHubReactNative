import React from "react";
import { View, StyleSheet } from "react-native";
import Lottie from "lottie-react-native";

const CustomLoader = () => {
  return (
    <View style={styles.container}>
      <Lottie
        source={require("../../assets/images/Animation - 1727127620849.json")} // Replace with your animation file
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
    backgroundColor: "#e6e6e6", // Optional: set a background color
  },
  loader: {
    width: 80, // Adjust size as needed
    height: 80,
  },
});

export default CustomLoader;
