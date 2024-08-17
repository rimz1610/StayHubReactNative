import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Drawer = createDrawerNavigator();

const AddEditGymContent = ({ navigation }) => {
    const [gender, setGender] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [openingTime, setOpeningTime] = useState(new Date());
    const [closingTime, setClosingTime] = useState(new Date());
    const [showEventDate, setShowEventDate] = useState(false);
    const [showOpeningTime, setShowOpeningTime] = useState(false);
    const [showClosingTime, setShowClosingTime] = useState(false);

    const onChangeDate = (event, selectedDate, setDateFunction, setShowFunction) => {
        const currentDate = selectedDate || new Date();
        setShowFunction(false);
        setDateFunction(currentDate);
    };

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

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.formContainer}>
                    <View style={styles.row}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>Name</Text>
                            <TextInput style={styles.input} placeholder='Name' placeholderTextColor="#999" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>Gender</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setGender(value)}
                                items={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                ]}
                                style={pickerSelectStyles}
                                placeholder={{ label: 'Select Gender', value: null }}
                            />
                        </View>
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
                            <TouchableOpacity onPress={() => setShowOpeningTime(true)} style={styles.dateButton}>
                                <Text>{openingTime.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                            {showOpeningTime && (
                                <DateTimePicker
                                    value={openingTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setOpeningTime, setShowOpeningTime)}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.heading}>CLOSING TIME</Text>
                            <TouchableOpacity onPress={() => setShowClosingTime(true)} style={styles.dateButton}>
                                <Text>{closingTime.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                            {showClosingTime && (
                                <DateTimePicker
                                    value={closingTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setClosingTime, setShowClosingTime)}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.fullWidthContainer}>
                        <Text style={styles.heading}>RULES</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
                            placeholder='Rules'
                            placeholderTextColor="#999"
                            multiline
                        />
                    </View>
                    <View style={styles.fullWidthContainer}>
                        <Text style={styles.heading}>Equipment</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
                            placeholder='Equipment'
                            placeholderTextColor="#999"
                            multiline
                        />
                    </View>

                    <View style={styles.fullWidthContainer}>
                        <Text style={styles.heading}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
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
    roomheading: {
        color: '#180161',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    formContainer: {
        width: '100%',
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    heading: {
        marginBottom: 5,
        fontWeight: '600',
        fontSize: 14,
        color: '#333',
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
    input: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: 'white',
    },
    fullWidthContainer: {
        width: '100%',
        marginBottom: 15,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    saveButton: {
        backgroundColor: '#180161',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width:'70%',
        alignSelf:'center'
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: 'white',
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: 'white',
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