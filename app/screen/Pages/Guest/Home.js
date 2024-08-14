import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const 
Home = ( { navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  }
})
