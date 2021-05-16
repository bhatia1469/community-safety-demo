import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import AppTextInput from '../components/AppTextInput';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import styles from '../utils/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Api from '../utils/Api';
import Messager from '../utils/Messager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from 'react-native-country-picker-modal'

export default function SignUp() {
    const navigation = useNavigation()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [number, setNumber] = useState("")
    const [country, setCountry] = useState(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    function validate(arr) {
        for (let i = 0; i < Object.keys(arr).length; i++) {
            console.log(i, arr[Object.keys(arr)[i]])
        }
        Object.keys(arr).every((element, i) => {
            console.log(element)
        });
    }

    function onSignUp() {

        if (name.length == 0) {
            Messager.show("Name field can't be empty.")
        } else if (email.length == 0) {
            Messager.show("Email field can't be empty.")
        } else if (country == null) {
            Messager.show("Country field can't be empty.")
        } else if (number.length == 0) {
            Messager.show("Phone number field can't be empty.")
        } else if (password.length < 6) {
            Messager.show("Please choose strong password with more than 6 characters.")
        } else if (password != confirmPassword) {
            Messager.show("Password and confirm password doesn't match.")
        } else {
            let data = {
                name, email, number, password, isVerified: false, contacts: [],
                presetMessage: "I am in danger. Please Help!!", countryCode: `+${country.callingCode[0]}`
            }
            Api.createProfile(data).then(res => {
                console.log(res)
                if (res) {
                    AsyncStorage.setItem('userData', JSON.stringify(res))
                    Messager.show("Profile created successfully.")
                    navigation.navigate('VerifyOtp', { number: number, countryCode: `+${country.callingCode[0]}`, purpose: 'SignUp' })
                }
            })
        }
    }

    return (
        <KeyboardAwareScrollView style={[styles.container]} >

            <View style={{ height: 200, backgroundColor: Colors.appBlue }} />
            <Image style={styles.logo} source={require('../assets/images/logo.png')} />
            <View style={styles.content}>
                <Text style={styles.titleText}>Sign Up</Text>
                <Text style={styles.subtitleText}>Sign up your account</Text>

                <AppTextInput
                    image={require('../assets/images/user.png')}
                    onSubmitEditing={() => { }}
                    style={{ marginTop: 20 }}
                    value={name}
                    onChangeText={setName}
                    placeholder={"Full name"} />

                <AppTextInput
                    image={require('../assets/images/email.png')}
                    placeholder={"Email id"}
                    value={email}
                    onSubmitEditing={() => { }}
                    keyboardType='email-address'
                    onChangeText={setEmail} />

                <View style={styles.countryCodeCont}>
                    <Image
                        source={require('../assets/images/globe.png')}
                        style={[styles.iconSmall, { marginStart: 10, marginEnd: 12 }]} />
                    <CountryPicker
                        onSelect={(country) => {
                            setCountry(country)
                        }}
                        autoFocusFilter={true}
                        withEmoji={true}
                        closeable={true}
                        withFilter={true}
                        withFlag={true}
                        withFlagButton={true}
                        withCountryNameButton={true}
                        placeholder={<Text style={{ color: country ? 'black' : '#898F97' }}>{country ? country.name : "Country"}</Text>}
                        withAlphaFilter={true}
                        withCallingCode={false}
                    />
                </View>

                <AppTextInput
                    image={require('../assets/images/phone.png')}
                    placeholder={"Phone number"}
                    value={number}
                    keyboardType='phone-pad'
                    onSubmitEditing={() => { }}
                    onChangeText={setNumber} />

                <AppTextInput
                    image={require('../assets/images/pwd.png')}
                    type={'password'}
                    placeholder={"Password"}
                    value={password}
                    onSubmitEditing={() => { }}
                    onChangeText={setPassword} />

                <AppTextInput
                    image={require('../assets/images/pwd.png')}
                    type={'password'}
                    placeholder={"Confirm password"}
                    value={confirmPassword}
                    onSubmitEditing={() => { }}
                    onChangeText={setConfirmPassword} />


                <Button
                    title={"Sign Up"}
                    textColor={'white'}
                    style={{ marginTop: 20 }}
                    backgroundColor={Colors.green}
                    onSubmitEditing={() => { }}
                    onPress={onSignUp} />

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={
                        [styles.subtitleText,
                        { alignSelf: 'center', fontSize: 18, marginBottom: 10 }]}>
                        Already have an account? <Text style={{ color: Colors.green }}
                            onPress={() => navigation.goBack()} >Sign In</Text></Text>
                </View>

            </View>
        </KeyboardAwareScrollView >
    );
}