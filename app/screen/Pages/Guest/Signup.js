import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ImageBackground, 
  TouchableWithoutFeedback, 
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";

const Signup = ({ navigation }) => {
    const [submitting, setSubmitting] = React.useState(false);
    
    const SignUpSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().required("Required"),
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        city: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        phoneNumber: Yup.string().required("Required"),
        zipcode: Yup.string().required("Required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            city: "",
            state: "",
            address: "",
            phoneNumber: "",
            zipCode: ""
        },
        validationSchema: SignUpSchema,
        onSubmit: values => {
            setSubmitting(true);
            axios.post("http://majidalipl-001-site5.gtempurl.com/Guest/Register", values)
                .then(function (response) {
                    if(response.data.success){
                        setSubmitting(false);
                        Alert.alert(
                            'Success',
                            'Account created successfully. Please login',
                            [{ 
                                text: 'OK', 
                                onPress: () => {
                                    navigation.navigate('Login');
                                }
                            }]
                        );
                    } else {
                        setSubmitting(false);
                        Alert.alert(
                            'Register Failed',
                            response.data.message,
                            [{ text: 'OK' }]
                        );
                    }
                })
                .catch(function (error) {
                    console.warn(error);
                    setSubmitting(false);
                });
        },
    });

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ImageBackground source={require('../../../../assets/images/front.jpg')} style={styles.bg}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.maincontainer}>
                            <Text style={styles.logintext}>Register as guest</Text>
                            <View style={styles.formContainer}>
                                <Text style={styles.heading}>First Name</Text>
                                <TextInput
                                    onChangeText={formik.handleChange('firstName')}
                                    value={formik.values.firstName}
                                    style={styles.input}
                                    placeholder='First Name'
                                    placeholderTextColor="white"
                                />
                                <Text style={styles.heading}>Last Name</Text>
                                <TextInput
                                    onChangeText={formik.handleChange('lastName')}
                                    value={formik.values.lastName}
                                    style={styles.input}
                                    placeholder='Last Name'
                                    placeholderTextColor="white"
                                />
                                <Text style={styles.heading}>Email Address</Text>
                                <TextInput 
                                    placeholder='Email'  
                                    onChangeText={formik.handleChange('email')}
                                    value={formik.values.email}
                                    placeholderTextColor="white" 
                                    keyboardType="email-address" 
                                    style={styles.input} 
                                />
                                <Text style={styles.heading}>Password</Text>
                                <TextInput 
                                    placeholder='Password' 
                                    placeholderTextColor="white" 
                                    secureTextEntry={true} 
                                    style={styles.input} 
                                    onChangeText={formik.handleChange('password')}
                                    value={formik.values.password}
                                />
                                <Text style={styles.heading}>Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Address'
                                    placeholderTextColor="white"
                                    onChangeText={formik.handleChange('address')}
                                    value={formik.values.address}
                                />
                                <View style={styles.row}>
                                    <View style={styles.CityContainer}>
                                        <Text style={styles.heading}>City</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='City'
                                            placeholderTextColor="white"
                                            onChangeText={formik.handleChange('city')}
                                            value={formik.values.city}
                                        />
                                    </View>
                                    <View style={styles.StateContainer}>
                                        <Text style={styles.heading}>State</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder='State'
                                            placeholderTextColor="white"
                                            onChangeText={formik.handleChange('state')}
                                            value={formik.values.state}
                                        />            
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.phoneContainer}>
                                        <Text style={styles.heading}>Phone Number</Text>
                                        <TextInput
                                            style={styles.shortInput}
                                            placeholder='Phone Number'
                                            placeholderTextColor="white"
                                            keyboardType='phone-pad'
                                            onChangeText={formik.handleChange('phoneNumber')}
                                            value={formik.values.phoneNumber}
                                        />
                                    </View>
                                    <View style={styles.zipContainer}>
                                        <Text style={styles.heading}>Zip Code</Text>
                                        <TextInput
                                            style={styles.shortInput}
                                            placeholder='Zip Code'
                                            placeholderTextColor="white"
                                            keyboardType='numeric'
                                            onChangeText={formik.handleChange('zipcode')}
                                            value={formik.values.zipcode}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    disabled={submitting}
                                    onPress={formik.handleSubmit}
                                >
                                    <Text style={styles.submitText}>Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.register}>Already have an account? Login</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        flex: 1,
        resizeMode: 'cover',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    maincontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
        maxWidth: 300,
    },
    logintext: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        color: 'white',
        borderColor: 'grey',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    phoneContainer: {
        width: '48%',
    },
    zipContainer: {
        width: '48%',
    },
    CityContainer: {
        width: '48%',
    },
    StateContainer: {
        width: '48%',
    },
    shortInput: {
        color:'white',
        borderColor: 'grey',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    heading: {
        marginBottom: 5,
        fontWeight: '400',
        fontSize: 16,
        color: 'white',
    },
    register: {
        color: '#007bff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        textDecorationLine: 'underline',
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#0A1D56',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Signup;