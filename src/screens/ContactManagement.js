import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ReactNativeModal from 'react-native-modal';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import styles from '../utils/styles'
import Api from '../utils/Api';
import Messager from '../utils/Messager';
import { selectContactPhone } from 'react-native-select-contact';
import CountryPicker from 'react-native-country-picker-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactManagement() {
    const navigation = useNavigation()
    const [isVisible, setVisibility] = useState(false)
    const [selectedContact, setSelectedContact] = useState("")
    const [myContacts, setMyContacts] = useState([])
    const [temp, setTemp] = useState(1)
    const [countryCode, setCountryCode] = useState("")
    const [number, setNumber] = useState("")
    const [name, setName] = useState("")

    function onClose() {
        setVisibility(false)
    }

    useEffect(() => {
        AsyncStorage.getItem('userData').then(res => {
            setCountryCode(JSON.parse(res).countryCode)
        })
    }, [])

    function getPhoneNumber() {
        return selectContactPhone()
            .then(selection => {
                if (!selection) {
                    return null;
                }

                let { contact, selectedPhone } = selection;
                console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
                setVisibility(true)
                // let data = {
                //     name: contact.name,
                //     number: selectedPhone.number
                // }
                setName(contact.name)
                setNumber(selectedPhone.number.replace(/ /g, '').replace(/-/g, ''))
                // setSelectedContact(data)
            });
    }

    useEffect(() => {
        Api.getDetails().then(res => {
            setMyContacts(res.contacts)
        })
    }, [temp])

    async function pickContact() {
        onClose()
        setTimeout(async () => {
            getPhoneNumber()
        }, 500);
    }

    function onContactAdd() {
        onClose()
        if (name.length == 0) {
            Messager.show("Name field can't be empty.")
        } else if (number.length == 0) {
            Messager.show("Number field can't be empty.")
        } else {
            let data = { name, number, countryCode }
            Api.addContact(data).then(res => {
                if (res) {
                    Messager.show('Contact added successfully')
                    setTemp(temp + 1)
                    setSelectedContact("")
                }
            })
        }

    }

    function deleteContact(contact) {
        Api.removeContact(contact).then(res => {
            if (res) {
                Messager.show('Contact deleted successfully')
                setTemp(temp + 1)
            }
        })
    }

    return (
        <View style={styles.container}>

            <View style={{ height: 150, backgroundColor: Colors.appBlue, alignItems: 'center' }} >
                <AppHeader
                    title={"Contact Management"}
                    leftIcon={require('../assets/images/back.png')}
                    onLeftPress={() => navigation.goBack()}
                />
            </View>

            <View style={[styles.pageBack, { top: -50, width: 100, shadowOpacity: 0 }]}>
                <Image style={[styles.icon50, { alignSelf: 'center' }]} source={require('../assets/images/phone-book.png')} />
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={myContacts}
                    style={{ flex: 1 }}
                    renderItem={({ item, index }) => {
                        return <View style={[styles.pageBack, styles.contactItemCont]}>
                            <View style={[styles.horEnd, {
                                borderBottomColor: 'lightgray',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                paddingBottom: 20,
                            }]}>
                                <Image style={styles.icon32} source={require('../assets/images/dummy.png')} />
                                <View style={styles.contactTextCont}>
                                    <Text style={styles.settingItemLabel}>{item.name}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 18 }}>Action</Text>
                                <Button
                                    title={"Delete"}
                                    textColor={Colors.red}
                                    image={require('../assets/images/delete.png')}
                                    style={{ borderColor: Colors.red, borderWidth: 1, height: 30, borderRadius: 5, paddingHorizontal: 10 }}
                                    backgroundColor={'white'}
                                    textStyle={{ fontSize: 16 }}
                                    onPress={() => deleteContact(item)} />
                            </View>
                        </View>
                    }}
                />
            </View>

            <View style={{ margin: 20 }}>
                <Button
                    title={"Add New"}
                    textColor={Colors.green}
                    image={require('../assets/images/add.png')}
                    style={{ borderColor: Colors.green, borderWidth: 1, width: '100%', borderRadius: 5, paddingHorizontal: 10 }}
                    backgroundColor={Colors.background}
                    textStyle={{ fontSize: 16 }}
                    onPress={() => setVisibility(true)} />
            </View>

            <ReactNativeModal
                isVisible={isVisible}
                onBackButtonPress={onClose}
                onBackdropPress={onClose}
                backdropOpacity={0.8}
                style={styles.modalBox}
                useNativeDriver={true}>

                <View style={styles.optionsBox}>
                    <Text style={[{ fontSize: 20, fontWeight: '500' }]}>Add Contact</Text>

                    <Button
                        title={"Pick Contact"}
                        textColor={Colors.green}
                        style={{ borderColor: Colors.green, marginTop: 20, borderWidth: 1, width: '100%', borderRadius: 5 }}
                        backgroundColor={Colors.background}
                        textStyle={{ fontSize: 16 }}
                        onPress={() => pickContact()} />

                    <AppTextInput
                        image={require('../assets/images/user.png')}
                        placeholder={"Name"}
                        style={{ marginTop: 20 }}
                        value={name}
                        onSubmitEditing={() => { }}
                        onChangeText={setName} />
                    <View style={{ flexDirection: 'row' }}>
                        <AppTextInput
                            image={require('../assets/images/phone.png')}
                            placeholder={"+1"}
                            value={countryCode}
                            maxLength={5}
                            style={{ width: '40%' }}
                            keyboardType='phone-pad'
                            onSubmitEditing={() => { }}
                            onChangeText={setCountryCode} />

                        <AppTextInput
                            placeholder={"Phone number"}
                            value={number}
                            style={{ flex: 1, marginStart: 10 }}
                            maxLength={15}
                            keyboardType='phone-pad'
                            onSubmitEditing={() => { }}
                            onChangeText={setNumber} />
                    </View>

                    <Button
                        title={"Save"}
                        textColor={'white'}
                        style={{ margin: 10, marginTop: 20, width: '100%' }}
                        backgroundColor={Colors.green}
                        onPress={onContactAdd} />
                </View>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={styles.cancelBox}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

            </ReactNativeModal>
        </View>
    );
}