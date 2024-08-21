import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DrawerContent from '../../../../components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const addEditSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    shortDescription: Yup.string().required("Required"),
    eventDate: Yup.date().required("Required"),
    bookingStartDate: Yup.date().required("Required"),
    bookingEndDate: Yup.date().required("Required"),
    description: Yup.string().required("Required"),
    eventImage: Yup.string().notRequired(),
    startTime: Yup.object().required("Required"),
    endTime: Yup.object().required("Required"),
    location: Yup.string().required("Required"),
    adultTicketPrice: Yup.number().min(0, "Must be positive"),
    childTicketPrice: Yup.number().min(0, "Must be positive"),
    maxTicket: Yup.number().min(0, "Must be positive"),

});
const AddEditEventContent = ({ navigation }) => {
    const [image, setImage] = useState(null);
    // const [bookingStartDate, setBookingStartDate] = useState(new Date());
    // const [bookingEndDate, setBookingEndDate] = useState(new Date());
    // const [eventDate, setEventDate] = useState(new Date());
    // const [startTime, setStartTime] = useState(new Date());
    // const [endTime, setEndTime] = useState(new Date());

    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [showEventDate, setShowEventDate] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

  

    const [submitting, setSubmitting] = useState(false);

    const id = route.params?.id || 0;
    const initialValues = {
        id: 0,
        name: "",
        shortDescription: "",
        eventDate: new Date(),
        bookingStartDate: new Date(),
        bookingEndDate: new Date(),
        description: "",
        eventImage: Yup.string().notRequired(),
        startTime: new Date(),
        endTime: new Date(),
        location: "",
        adultTicketPrice: 0,
        childTicketPrice: 0,
        maxTicket: 0,
    };

    const fetchEventData = useCallback(async (formikSetValues) => {

        if (id > 0) {
            try {
                const token = await AsyncStorage.getItem('token');

                const response = await axios.get(`http://majidalipl-001-site5.gtempurl.com/Event/GetEventById?id=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.data.success) {

                    formikSetValues(response.data.data);
                } else {
                    Alert.alert('Error', response.data.message);
                }
            } catch (error) {

                Alert.alert('Error', 'Failed to fetch room data');
            }
        }
    }, [id]);

    const handleSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post("http://majidalipl-001-site5.gtempurl.com/Event/AddEditEvent", values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                Alert.alert(
                    'Success',
                    'Event saved successfully.',
                    [{
                        text: 'OK',
                        onPress: () => navigation.navigate('EventList')
                    }]
                );
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {

            Alert.alert('Error', 'An error occurred while saving the event.');
        } finally {
            setSubmitting(false);
        }
    }, [navigation]);





    return (
        <Formik
            initialValues={initialValues}
            validationSchema={addEditSchema}
            onSubmit={handleSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting, setValues }) => {
                useEffect(() => {
                    fetchEventData(setValues);
                }, [fetchEventData, setValues]);
              
                return (
                    <View style={styles.container}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                                <Ionicons name="menu" size={24} color="black" />
                            </TouchableOpacity>

                            <Text style={styles.roomheading}>Add / Edit Event</Text>
                            <TouchableOpacity style={styles.addButton} onPress={() => {
                                navigation.navigate('EventList')
                            }}>
                                <Text style={styles.addButtonText}>Back</Text>
                            </TouchableOpacity>


                            <View style={styles.formContainer}>
                                <View style={styles.row}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>Name</Text>
                                        <TextInput
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                            style={styles.input}
                                            placeholder="Name"
                                            placeholderTextColor="#999"
                                        />
                                        {touched.name && errors.name && (
                                            <Text style={styles.errorText}>{errors.name}</Text>
                                        )}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>Short Description</Text>
                                        <TextInput
                                            onChangeText={handleChange('shortDescription')}
                                            value={values.shortDescription}
                                            style={styles.input}
                                            placeholder="Short Description"
                                            placeholderTextColor="#555"
                                        />
                                        {touched.shortDescription && errors.shortDescription && (
                                            <Text style={styles.errorText}>{errors.shortDescription}</Text>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>BOOKING START DATE</Text>
                                        <TouchableOpacity onPress={() => setShowStartDate(true)} style={styles.dateButton}>
                                            <Text>{values.bookingStartDate.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                        {showStartDate && (
                                            <DateTimePicker
                                                value={values.bookingStartDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => { 
                                                    const currentDate = selectedDate || new Date();
                                                    setShowStartDate(false);
                                                    setFieldValue("bookingStartDate", currentDate);}}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.bookinginputContainer}>
                                        <Text style={styles.heading}>BOOKING END DATE</Text>
                                        <TouchableOpacity onPress={() => setShowEndDate(true)} style={styles.dateButton}>
                                            <Text>{bookingEndDate.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                        {showEndDate && (
                                            <DateTimePicker
                                                value={bookingEndDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => { 
                                                    const currentDate = selectedDate || new Date();
                                                    setShowEndDate(false);
                                                    setFieldValue("bookingEndDate", currentDate);}}
                                               
                                            />
                                        )}
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>EVENT DATE</Text>
                                        <TouchableOpacity onPress={() => setShowEventDate(true)} style={styles.dateButton}>
                                            <Text>{eventDate.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                        {showEventDate && (
                                            <DateTimePicker
                                                value={eventDate}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setEventDate, setShowEventDate)}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>START TIME</Text>
                                        <TouchableOpacity onPress={() => setShowStartTime(true)} style={styles.dateButton}>
                                            <Text>{startTime.toLocaleTimeString()}</Text>
                                        </TouchableOpacity>
                                        {showStartTime && (
                                            <DateTimePicker
                                                value={startTime}
                                                mode="time"
                                                display="default"
                                                onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setStartTime, setShowStartTime)}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>END TIME</Text>
                                        <TouchableOpacity onPress={() => setShowEndTime(true)} style={styles.dateButton}>
                                            <Text>{endTime.toLocaleTimeString()}</Text>
                                        </TouchableOpacity>
                                        {showEndTime && (
                                            <DateTimePicker
                                                value={endTime}
                                                mode="time"
                                                display="default"
                                                onChange={(event, selectedDate) => onChangeDate(event, selectedDate, setEndTime, setShowEndTime)}
                                            />
                                        )}
                                    </View>
                                </View>
                                <View style={styles.fullWidthContainer}>
                                    <Text style={styles.heading}>LOCATION</Text>
                                    <TextInput style={styles.input} placeholder='Location' placeholderTextColor="#999" />
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

                                <View style={styles.row}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>ADULT TICKET PRICE</Text>
                                        <TextInput style={styles.input} placeholder='0' keyboardType='numeric' placeholderTextColor="#999" />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>CHILD TICKET PRICE</Text>
                                        <TextInput style={styles.input} placeholder='0' keyboardType='numeric' placeholderTextColor="#999" />
                                    </View>
                                    <View style={styles.maxinputContainer}>
                                        <Text style={styles.heading}>MAX TICKETS</Text>
                                        <TextInput style={styles.input} placeholder='0' keyboardType='numeric' placeholderTextColor="#999" />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>Upload Image</Text>
                                        <TouchableOpacity style={styles.uploadButton}>
                                            <Text style={styles.uploadButtonText}>Choose File</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        {/* {image && <Image source={{ uri: '' }} style={styles.imagePreview} />} */}
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>);
            }}
        </Formik>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        padding: 10,
    },
    addButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#180161',
        padding: 10,
        borderRadius: 4,
        marginBottom: 20,
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
    input: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: 'white',
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
    maxinputContainer: {
        flex: 1,
        marginRight: 10,
        marginTop: 15
    },
    bookinginputContainer: {
        flex: 1,
        marginRight: 10,
        marginTop: 15
    },
    fullWidthContainer: {
        width: '100%',
        marginBottom: 15,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#180161',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 14,
    },
    // imagePreview: {
    //     width: '100%',
    //     height: 150,
    //     resizeMode: 'cover',
    //     borderRadius: 4,
    // },
    saveButton: {
        backgroundColor: '#180161',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#180161',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        backgroundColor: 'white',
    },

});

const AddEditEvent = () => {
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
            <Drawer.Screen name="AddEditEventContent" component={AddEditEventContent} />
        </Drawer.Navigator>
    );
};



export default AddEditEvent;
