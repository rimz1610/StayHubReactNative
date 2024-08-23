import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BookingItems = ({ navigation }) => {


    return (
        <View>
            
            <TouchableOpacity
                onPress={() => navigation.navigate('Checkout')}
            >
                <Text
                >
                    Proceed to Payment
                </Text>
            </TouchableOpacity>
        </View>
    )
}
export default BookingItems;