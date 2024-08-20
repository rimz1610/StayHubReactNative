// RoomBooking.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TabNavigator from '../../../TabNavigator';

const RoomBooking = () => {
  return (
    <View style={styles.container}>
      <Text>Room Booking Screen</Text>
    </View>
  );
};

export default RoomBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});