import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'

const Login = (props) => {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
            <ImageBackground source={require('./../../assets/images/back.jpg')} style={styles.bg}>
                <View style={styles.maincontainer}>
                    <Text style={styles.logintext}>Login</Text>
                  
                    <View style={styles.formContainer}>
                        <Text style={styles.heading}>Email Address</Text>
                        <TextInput placeholder='Email'  placeholderTextColor="white" keyboardType={"email-address"} style={styles.input} />
                        <Text style={styles.heading}>Password</Text>
                        <TextInput placeholder='Password' placeholderTextColor="white" secureTextEntry={true} style={styles.input} />
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
                    <Text style={styles.register}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default Login

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
        textDecorationLine: 'underline',
    },
});
