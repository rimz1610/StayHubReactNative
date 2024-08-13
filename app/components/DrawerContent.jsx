import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => props.navigation.navigate('BookingDetails')}
        >
          <Text style={styles.drawerItemText}>Booking Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => props.navigation.navigate('Room')}
        >
          <Text style={styles.drawerItemText}>Room</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
  },
});

export default DrawerContent;