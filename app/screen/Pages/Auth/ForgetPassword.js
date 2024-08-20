import React from 'react';
import { View, Text, TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet } from 'react-native';

const ForgetPassword = ({ navigation }) => {
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
        <ImageBackground source={require('../../../../assets/images/back.jpg')} style={styles.bg}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <Text style={styles.heading}>Forget Password</Text>

            <Text style={styles.label}>Please Enter Your Email</Text>
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />

            <TouchableOpacity style={styles.backbtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.backToLogin}>Back to Login?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton}  onPress={() => navigation.navigate('ResetPassword')} >
                <Text style={styles.submitButtonText}>Submit</Text>
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
        marginLeft:30,
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
});

export default ForgetPassword;
