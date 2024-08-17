import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Drawer = createDrawerNavigator();

const AddEditSpaContent = ({ navigation }) => {
    const [openingTime, setOpeningTime] = useState(new Date());
    const [closingTime, setClosingTime] = useState(new Date());
    const [showOpeningTime, setShowOpeningTime] = useState(false);
    const [showClosingTime, setShowClosingTime] = useState(false);

    const onChangeTime = (event, selectedTime, setTimeFunction, setShowFunction) => {
        const currentTime = selectedTime || new Date();
        setShowFunction(false);
        setTimeFunction(currentTime);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.roomheading}>Add / Edit Spa</Text>
            <TouchableOpacity style={styles.backbtn} onPress={() => {
                navigation.navigate('SpaList')
            }}>
                <Text style={styles.backbtnText}>Back</Text>
            </TouchableOpacity>

           
                <View style={styles.formContainer}>
                    <View style={styles.fullWidthContainer}>
                        <Text style={styles.heading}>Name</Text>
                        <TextInput style={styles.input} placeholder='Name' placeholderTextColor="#999" />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>FEE</Text>
                            <TextInput style={styles.input} placeholder='Fee' placeholderTextColor="#999" keyboardType="numeric" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>CAPACITY</Text>
                            <TextInput style={styles.input} placeholder='Capacity' placeholderTextColor="#999" keyboardType="numeric" />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>OPENING TIME</Text>
                            <TouchableOpacity onPress={() => setShowOpeningTime(true)} style={styles.timeButton}>
                                <Text>{openingTime.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                            {showOpeningTime && (
                                <DateTimePicker
                                    value={openingTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, selectedTime) => onChangeTime(event, selectedTime, setOpeningTime, setShowOpeningTime)}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>CLOSING TIME</Text>
                            <TouchableOpacity onPress={() => setShowClosingTime(true)} style={styles.timeButton}>
                                <Text>{closingTime.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                            {showClosingTime && (
                                <DateTimePicker
                                    value={closingTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, selectedTime) => onChangeTime(event, selectedTime, setClosingTime, setShowClosingTime)}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.fullWidthContainer}>
                        <Text style={styles.heading}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder='Description'
                            placeholderTextColor="#999"
                            multiline
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        padding: 20,
    },
    backbtn: {
        alignSelf: 'flex-end',
        marginTop: 50,
        marginRight:10,
        padding: 10,
        backgroundColor: '#180161',
        borderRadius: 4,
    },
    backbtnText: {
        color: 'white',
        fontSize: 16,
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    roomheading: {
        color: '#180161',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    addButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#180161',
        padding: 10,
        borderRadius: 4,
        marginRight: 20,
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    formContainer: {
        width: '100%',
    },
    fullWidthContainer: {
        width: '100%',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    heading: {
        marginBottom: 5,
        fontWeight: '600',
        fontSize: 14,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
        backgroundColor: 'white',
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    timeButton: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        backgroundColor: 'white',
    },
    saveButton: {
        backgroundColor: '#180161',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width:'70%',
        alignSelf:'center',
        marginTop: 80,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const AddEditSpa = () => {
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
            <Drawer.Screen name="AddEditSpaContent" component={AddEditSpaContent} />
        </Drawer.Navigator>
    );
};

export default AddEditSpa;