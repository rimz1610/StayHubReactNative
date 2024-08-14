import { StyleSheet, Text, View, FlatList, Pressable, TextInput,TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();
const AddEditGymContent = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.roomheading}>Add / Edit Gym</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => {
              navigation.navigate('GymList')
            }}>
                <Text style={styles.addButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.formContainer}>
                <Text style={styles.heading}>Name</Text>
                <TextInput
                  //  onChangeText={formik.handleChange('firstName')}
                    //value={formik.values.firstName}
                    style={styles.input}
                    placeholder='Name'
                    placeholderTextColor="white"
                />
                <TouchableOpacity>
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    addButton: {
        marginTop: 30,
        alignSelf: 'flex-end',
        backgroundColor: '#180161',
        padding: 10,
        borderRadius: 4,
      },
      addButtonText: {
        color: 'white',
        fontSize: 16,
      },
    roomheading: {
        color: '#180161',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 300,
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    heading: {
        marginBottom: 5,
        fontWeight: '400',
        fontSize: 16,
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginVertical: 5,
        fontSize: 14,
    },

});
const AddEditGym = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: '60%',
                },
            }}
        >
            <Drawer.Screen name="AddEditGymContent" component={AddEditGymContent} />
        </Drawer.Navigator>
    );
};



export default AddEditGym;
