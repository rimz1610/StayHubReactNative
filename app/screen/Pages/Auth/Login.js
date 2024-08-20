import React from 'react';
import {
    StyleSheet,
    Text,
    Alert,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import {

    ActivityIndicator
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const Login = ({ navigation }) => {
    const [submitting, setSubmitting] = React.useState(false);

    const SetToken = async (loginModel) => {
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
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().required("Required")
    });

    const formik = useFormik({
        initialValues: {
            email: "admin@gmail.com",
            password: "Admin123"
        },
        validationSchema: SigninSchema,
        onSubmit: values => {
            setSubmitting(true);
            axios.post("http://majidalipl-001-site5.gtempurl.com/Account/Login", values)
                .then(function (response) {
                    if (response.data.success) {
                        SetToken(response.data.data);
                        setSubmitting(false);
                        var role = response.data.data.role;
                        if (role === "ADMIN") {
                            navigation.navigate('Dashboard');
                        } else if (role === "GUEST") {
                            navigation.navigate('RoomBooking');
                        }
                    } else {
                        setSubmitting(false);
                        Alert.alert(
                            'Login Failed',
                            "Invalid email or password",
                            [{ text: 'OK' }]
                        );
                    }
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ImageBackground source={require('../../../../assets/images/back.jpg')} style={styles.bg}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <TouchableOpacity style={styles.skipbtn} onPress={() => navigation.navigate('RoomBooking')}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                        <View style={styles.maincontainer}>
                            <Text style={styles.logintext}>Login</Text>
                            <View style={styles.formContainer}>
                                <Text style={styles.heading}>Email Address</Text>
                                <TextInput
                                    name="email"
                                    placeholder='Email'
                                    placeholderTextColor="white"
                                    onChangeText={formik.handleChange('email')}
                                    value={formik.values.email}
                                    keyboardType="email-address"
                                    style={styles.input}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <Text style={styles.errorText}>{formik.errors.email}</Text>
                                ) : null}
                                <Text style={styles.heading}>Password</Text>
                                <TextInput
                                    placeholder='Password'
                                    name='password'
                                    onChangeText={formik.handleChange('password')}
                                    value={formik.values.password}
                                    placeholderTextColor="white"
                                    secureTextEntry={true}
                                    style={styles.input}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <Text style={styles.errorText}>{formik.errors.password}</Text>
                                ) : null}
                                <Text style={styles.forgotPasswordText} onPress={()=> navigation.navigate('ForgetPassword')}>Forgot Password?</Text>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    disabled={submitting}
                                    onPress={formik.handleSubmit}
                                >
                                    {submitting ?
                                        <ActivityIndicator size="small" /> :
                                        <Text style={styles.submitText}>
                                            Login
                                        </Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.register}>Don't have an account? Register</Text>
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
        width: '100%',
        height: '100%',

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
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30,
    },
    heading: {
        marginBottom: 5,
        fontWeight: '400',
        fontSize: 16,
        color: 'white',
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
    forgotPasswordText: {
        color: '#007bff',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginBottom: 15,
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
    register: {
        color: '#007bff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        textDecorationLine: 'underline',
    },
    skipbtn: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(10, 29, 86, 0.7)',
        paddingHorizontal: 25,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
    },
    skipText: {
        color: 'white',
        fontSize: 14,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        
    },
});

export default Login;