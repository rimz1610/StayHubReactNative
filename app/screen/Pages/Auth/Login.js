import { StyleSheet, Text, Alert, View, ImageBackground, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const Login = ({ navigation }) => {
    //Login 
    //Email admin@gmail.com
    //password Admin123
    const [submitting, setSubmitting] = React.useState(false);
    const SetToken = async (loginModel) => {
        //in active expire time
        const expireTime = Date.now() + 300000;
        await AsyncStorage.setItem("expireTime", expireTime.toString());
        await AsyncStorage.setItem('token', loginModel.token);
        await AsyncStorage.setItem('expiry', loginModel.expiry.toString());
        await AsyncStorage.setItem('role', loginModel.role);
        await AsyncStorage.setItem('email', loginModel.email);
        await AsyncStorage.setItem('name', loginModel.name);
        await AsyncStorage.setItem('loginId', loginModel.id);
        await AsyncStorage.setItem('generated', new Date().toISOString());
    }
    const SigninSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Required")
        ,
        password: Yup.string()
            .required("Required")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""

        },
        validationSchema: SigninSchema,
        onSubmit: values => {
            setSubmitting(true);

            axios.post("http://majidalipl-001-site5.gtempurl.com/Account/Login", values)
                .then(function (response) {
                    if(response.data.success){
                        SetToken(response.data.data);
                        setSubmitting(false);
                        var role = response.data.data.role;
                        if (role === "ADMIN") {
                            
                            navigation.navigate('Dashboard')
                        }
                        else if (role == "GUEST") {
                            //navigate to Room Booking screen 
    
                        }
                        else {
    
                        }
                    }
                    else{
                        setSubmitting(false);
                        Alert.alert(
                            'Login Failed',
                            "Invalid email or password",
                            [{ text: 'OK' }]
                        );
                    }
                    // console.warn(response.data);
                   
                })
                .catch(function (error) {
                    console.log(error);
                    setSubmitting(false);
                    Alert.alert(
                        'Login Failed',
                        "Invalid email or password",
                        [{ text: 'OK' }]
                    );
                });

        },
    });
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                 <ImageBackground source={require('./../../assets/images/back.jpg')} style={styles.bg}> 
                <TouchableOpacity style={styles.skipbtn} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                <View style={styles.maincontainer}>
                    <Text style={styles.logintext}>Login</Text>
                    <View style={styles.formContainer}>
                        <Text style={styles.heading}>Email Address</Text>
                        <TextInput name="email" placeholder='Email' placeholderTextColor="white" onChangeText={formik.handleChange('email')}
                            value={formik.values.email}
                            keyboardType={"email-address"} style={styles.input} />
                        <Text style={styles.heading}>Password</Text>
                        <TextInput placeholder='Password' name='password'
                            onChangeText={formik.handleChange('password')}
                            value={formik.values.password} placeholderTextColor="white" secureTextEntry={true} style={styles.input} />

                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        <TouchableOpacity style={styles.submitButton} disabled={submitting}
                            onPress={() =>
                                formik.handleSubmit()
                            }>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.register}>Don't have an account? Register</Text>
                </TouchableOpacity>
             </ImageBackground> 
            </View>
        </TouchableWithoutFeedback>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bg: {
        flex: 1,
        resizeMode: 'cover',
    },
    maincontainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    formContainer: {
        borderColor: 'black',
        textAlign: 'center',
        justifyContent: 'center',
        width: 300,
    },
    logintext: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30,
    },
    heading: {
        marginBottom: 5,
        fontWeight: '100',
        fontSize: 15,
        color: 'white',
    },
    input: {
        color: 'white',
        borderColor: 'grey',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    forgotPasswordText: {
        color: '#007bff',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#0A1D56',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
    },
    register: {
        color: '#007bff',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 15,
        textDecorationLine: 'underline',
    },
    skipbtn: {
        position: 'absolute',
        top: 25,
        right: 20,
        BackgroundColor: '#0A1D56',
        paddingHorizontal: 25,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
    },
    skipText: {
        color: 'white',
        fontSize: 12,
    },
});



