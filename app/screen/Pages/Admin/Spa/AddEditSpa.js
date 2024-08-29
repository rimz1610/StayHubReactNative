
import { StyleSheet, Text, View,  TextInput,  TouchableOpacity, Image, Alert,
    ScrollView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import DrawerContent from "../../../../components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();
const addEditSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    price: Yup.number().min(1, "Greater than zero"),
    capacity: Yup.number().min(1, "Greater than zero"),
    openingTime: Yup.string().required("Required"),
    closingTime: Yup.string().required("Required")
});
const AddEditSpaContent =  ({ route, navigation }) => {
   
    const [showOpeningTime, setShowOpeningTime] = useState(false);
    const [showClosingTime, setShowClosingTime] = useState(false);
    const formatTimeSpan = (date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };
    // Function to convert "HH:mm:ss" string to a Date object
    const timeStringToDate = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
    };

    const id = route.params?.id || 0;
    const initialValues = {
        id: 0,
        name: "",
        description: "",
        price: 0,
        capacity: 1,
        openingTime: "00:00:00",
        closingTime: "00:00:00",
    };


    const fetchSpaData = useCallback(
        async (formikSetValues, setFieldValue) => {
            if (id > 0) {
                try {
                    const token = await AsyncStorage.getItem("token");

                    const response = await axios.get(
                        `http://majidalipl-001-site5.gtempurl.com/Spa/GetSpaById?id=${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.data.success) {
                        response.data.data.price= response.data.data.price.toString();
                        response.data.data.capacity=response.data.data.capacity.toString();
                     
                        formikSetValues(response.data.data);
                        console.warn(response.data.data);

                    } else {
                        Alert.alert("Error", response.data.message);
                    }
                } catch (error) {
                    Alert.alert("Error", "Failed to fetch spa data");
                }
            }
        },
        [id]
    );

    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);
                const token = await AsyncStorage.getItem("token");
                const response = await axios.post(
                    "http://majidalipl-001-site5.gtempurl.com/Spa/AddEditSpa",
                    values,
                    {
                        headers: { Authorization: `Bearer ${token}`, },
                    }
                );
                if (response.data.success) {
                    Alert.alert("Success", "Spa saved successfully.", [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("SpaList"),
                        },
                    ]);
                } else {
                    Alert.alert("Error", response.data.message);
                }
            } catch (error) {
                console.warn(error);
                Alert.alert("Error", "An error occurred while saving the spa.");
            } finally {
                setSubmitting(false);
            }
        },
        [navigation]
    );
 

    return (
        <Formik
        initialValues={initialValues}
        validationSchema={addEditSchema}
        onSubmit={handleSubmit}
    >
        {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            setValues,
        }) => {
            useEffect(() => {
                fetchSpaData(setValues, setFieldValue);

            }, [fetchSpaData, setValues]);

            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                        <Ionicons name="menu" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.roomheading}>Add / Edit Spa</Text>
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
                                    <TextInput
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        value={values.name}
                                        style={styles.input}
                                        placeholder="Name"
                                        placeholderTextColor="#999"
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.errorText}>{errors.name}</Text>
                                    )}

                                </View>
                              
                            </View>

                            <View style={styles.row}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.heading}>Price</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0"
                                        onChangeText={handleChange("price")}
                                        value={values.price}
                                        keyboardType="numeric"
                                        placeholderTextColor="#999"
                                    />
                                    {touched.price && errors.price && (
                                        <Text style={styles.errorText}>
                                            {errors.price}
                                        </Text>
                                    )}

                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.heading}>Capacity</Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="1"
                                        onChangeText={handleChange("capacity")}
                                        value={values.capacity}
                                        keyboardType="numeric"
                                        placeholderTextColor="#999"
                                    />
                                    {touched.capacity && errors.capacity && (
                                        <Text style={styles.errorText}>
                                            {errors.capacity}
                                        </Text>
                                    )}

                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.heading}>Opening Time</Text>
                                    <TouchableOpacity onPress={() => setShowOpeningTime(true)} style={styles.timeButton}>
                                        <Text>{timeStringToDate(values.openingTime).toLocaleTimeString()}</Text>
                                    </TouchableOpacity>
                                    {showOpeningTime && (
                                        <DateTimePicker
                                            value={timeStringToDate(values.openingTime)}
                                            mode="time"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                const currentDate = selectedDate || new Date();
                                                setShowOpeningTime(false);
                                                setFieldValue("openingTime", formatTimeSpan(currentDate));
                                            }}
                                        />
                                    )}
                                    {touched.openingTime && errors.openingTime && (
                                        <Text style={styles.errorText}>{errors.openingTime}</Text>
                                    )}
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.heading}>Closing Time</Text>
                                    <TouchableOpacity onPress={() => setShowClosingTime(true)} style={styles.timeButton}>
                                        <Text>{timeStringToDate(values.closingTime).toLocaleTimeString()}</Text>
                                    </TouchableOpacity>
                                    {showClosingTime && (
                                        <DateTimePicker
                                            value={timeStringToDate(values.closingTime)}
                                            mode="time"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                const currentDate = selectedDate || new Date();
                                                setShowClosingTime(false);
                                                setFieldValue("closingTime", formatTimeSpan(currentDate));
                                            }}
                                        />
                                    )}
                                </View>
                            </View>

                           
                           

                            <View style={styles.fullWidthContainer}>
                                <Text style={styles.heading}>Description</Text>
                                <TextInput
                                    onChangeText={handleChange("description")}
                                    value={values.description}
                                    style={[styles.input, styles.descriptionInput]}
                                    placeholder='Description'
                                    placeholderTextColor="#999"
                                    multiline
                                />
                                {touched.description && errors.description && (
                                    <Text style={styles.errorText}>{errors.description}</Text>
                                )}
                            </View>

                            <TouchableOpacity style={styles.saveButton} disabled={isSubmitting}
                                onPress={handleSubmit}>
                                <Text style={styles.saveButtonText}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            );
        }}
    </Formik>
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
    errorText: {
        fontSize: 12,
        color: "red",
      },
});

const AddEditSpa =({ route }) => {
    const { id } = route.params || {};
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
            <Drawer.Screen name="AddEditSpaContent" component={AddEditSpaContent}  initialParams={{ id: id }}/>
        </Drawer.Navigator>
    );
};

export default AddEditSpa;