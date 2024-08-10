import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Dashboard from './Dashboard'

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  return (
   <NavigationContainer>
        <Stack.Navigator 
            screenOptions={{ headerShown: false}}
            initialRouteName='Main'>
                <Stack.Screen name='Main' component={Dashboard}/>
        </Stack.Navigator>
   </NavigationContainer>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})