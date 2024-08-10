import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Signup = (props) => {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <ImageBackground source={require('./../../assets/images/front.jpg')} style={styles.bg}>
                    <View style={styles.maincontainer}>
                        <Text style={styles.logintext}>Register as guest</Text>
                        <View style={styles.formContainer}>
                            <View>
                                <Text style={styles.heading}>First Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='First Name'
                                    placeholderTextColor="white"
                                />
                                <Text style={styles.heading}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Last Name'
                                    placeholderTextColor="white"
                                />
                            </View>
                            <Text style={styles.heading}>Email Address</Text>
                            <TextInput 
                                placeholder='Email'  
                                placeholderTextColor="white" 
                                keyboardType={"email-address"} 
                                style={styles.input} 
                            />
                            <Text style={styles.heading}>Password</Text>
                            <TextInput 
                                placeholder='Password' 
                                placeholderTextColor="white" 
                                secureTextEntry={true} 
                                style={styles.input} 
                            />
                            <View>
                                <Text style={styles.heading}>Address</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Address'
                                    placeholderTextColor="white"
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={styles.CityContainer}>
                                    <Text style={styles.heading}>City</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='City'
                                        placeholderTextColor="white"
                                    />
                                </View>
                                <View style={styles.StateContainer}>
                                    <Text style={styles.heading}>State</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='State'
                                        placeholderTextColor="white"
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
                                    />
                                </View>
                                <View style={styles.zipContainer}>
                                    <Text style={styles.heading}>Zip Code</Text>
                                    <TextInput
                                        style={styles.shortInput}
                                        placeholder='Zip Code'
                                        placeholderTextColor="white"
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => props.navigation.navigate('Login')}>
                                <Text style={styles.submitText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
                        <Text style={styles.register}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Signup

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
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
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
        borderColor: 'grey',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    heading: {
        marginBottom: 5,
        fontWeight: '100',
        fontSize: 15,
        color: 'white',
    },
    register: {
        color: '#007bff',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 15,
        textDecorationLine: 'underline',
    },
    submitButton: {
        marginTop: 5,
        backgroundColor: '#0A1D56',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
    },
});
