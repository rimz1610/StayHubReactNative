import React from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,ActivityIndicator,
    StyleSheet, Alert
} from 'react-native';
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const ForgotPassword = ({ navigation }) => {
    const [submitting, setSubmitting] = React.useState(false);
    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Required")
    });

    const formik = useFormik({
        initialValues: {
            email: "admin@gmail.com"
        },
        validationSchema: ForgotPasswordSchema,
        onSubmit: (values) => {
            setSubmitting(true);
            axios
                .post("http://majidalipl-001-site5.gtempurl.com/Account/ForgotPassword", values)
                .then(function (response) {
                    if (response.data.success) {
                        setSubmitting(false);
                        Alert.alert(
                            'Success',
                            response.data.message,
                            [{
                                text: 'OK',
                                onPress: () => navigation.navigate('ResetPassword')
                            }]
                        );
                    } else {
                        setSubmitting(false);
                        Alert.alert("Request failed", response.data.message, [
                            { text: "OK" },
                        ]);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    setSubmitting(false);
                    Alert.alert("Request Failed", "Please try again later.", [
                        { text: "OK" },
                    ]);
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
                    <View style={styles.container}>
                        <Text style={styles.heading}>Forgot Password</Text>

                        <Text style={styles.label}>Please Enter Your Email</Text>
                        <TextInput
                            name="email"
                            placeholder="Email"
                            placeholderTextColor="white"
                            onChangeText={formik.handleChange("email")}
                            value={formik.values.email}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <Text style={styles.errorText}>{formik.errors.email}</Text>
                        ) : null}

                        <TouchableOpacity style={styles.backbtn} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.backToLogin}>Back to Login?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.submitButton} disabled={submitting} onPress={formik.handleSubmit} >
                            {submitting ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Submit</Text>
                            )}

                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
    },
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
        color: 'white',
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        marginLeft: 30,
        fontSize: 15,
        marginBottom: 8,
    },
    input: {
        width: '85%',
        height: 50,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    backToLogin: {
        fontSize: 14,
        color: '#007BFF',
        textDecorationLine: 'underline',
        marginBottom: 30,
    },
    submitButton: {
        width: '60%',
        height: 50,
        backgroundColor: '#0A1D56',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 12,
        color: 'red',

    },
});

export default ForgotPassword;
