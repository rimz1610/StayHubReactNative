import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Postpages = ( { navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={ ()=> navigation.navigate('Dashboard')} style={styles.pagesbtn1}><Text>Manage Booking</Text></TouchableOpacity>
      <TouchableOpacity onPress={ ()=> navigation.navigate('Room')} style={styles.pagesbtn2}><Text>Manage Rooms</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn3}><Text>Add /Edit Room</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn4}><Text>price and availability details</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn5}><Text>Set Room pricing Details</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn6}><Text>Events</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn7}><Text>Create and Edit Events</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn8}><Text>Staff</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn9}><Text>Staff Activities</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn10}><Text>Guest</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn11}><Text>Guest Details</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn12}><Text>Gym</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn13}><Text>Create and Edit Gym</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn14}><Text>Spa</Text></TouchableOpacity>
      <TouchableOpacity style={styles.pagesbtn15}><Text>Create and Edit Spa</Text></TouchableOpacity>
    </View>
  )
}

export default Postpages

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  pagesbtn1:{  
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    
  },
  pagesbtn2:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn3:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn4:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn5:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn6:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn7:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn8:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn9:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn10:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn11:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn12:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn13:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn14:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  pagesbtn15:{
    marginTop:5,
    marginBottom:5,
    top: 5,
    right: 20,
    BackgroundColor: 'black',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  }
})
