import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const HotelMap = ( { navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Spa</Text>
    </View>
  )
}

export default HotelMap;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  }
})
