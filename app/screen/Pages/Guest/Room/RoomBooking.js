import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const RoomBooking = ( { navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Rooms</Text>
    </View>
  )
}

export default RoomBooking;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  }
})
