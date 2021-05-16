import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ReactNativeModal from 'react-native-modal';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import Button from '../components/Button';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Messager from '../utils/Messager';
import styles from '../utils/styles'

export default function PresetMessage() {
    const navigation = useNavigation()
    const [isVisible, setVisibility] = useState(false)
    const [preset, setPreset] = useState("")

    function onClose() {
        setVisibility(false)
    }

    useEffect(() => {
        AsyncStorage.getItem('userData').then(res => {
            setPreset(JSON.parse(res).presetMessage)
        })
    }, [])

    function submit() {
        Api.updateDataSilently({ presetMessage: preset }).then(res => {
            AsyncStorage.setItem('userData', JSON.stringify(res))
            Messager.show('Preset message changed.')
        })
        setVisibility(false)
    }

    return (
        <View style={styles.container}>

            <View style={{ height: 150, backgroundColor: Colors.appBlue, alignItems: 'center' }} >
                <AppHeader
                    title={"Preset Message"}
                    leftIcon={require('../assets/images/back.png')}
                    onLeftPress={() => navigation.goBack()}
                />
            </View>

            <View style={[styles.pageBack, { top: -50, width: 100, shadowOpacity: 0 }]}>
                <Image style={[styles.icon50, { alignSelf: 'center' }]} source={require('../assets/images/preset.png')} />
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity style={[styles.pageBack, styles.contactItemCont]}>
                    <View style={[styles.horEnd, {
                        borderBottomColor: 'lightgray',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        paddingBottom: 20,
                    }]}>
                        <Text style={{ color: 'gray' }}>{preset}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ margin: 20 }}>
                <Button
                    title={"Edit"}
                    textColor={Colors.green}
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
                useNativeDriver={true}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'none'}>
                        <View style={styles.optionsBox}>
                            <Text style={[{ fontSize: 20, fontWeight: '500', marginVertical: 10 }]}>Edit Preset Text</Text>
                            <AppTextInput
                                onSubmitEditing={() => submit()}
                                textInputStyle={styles.bigInput}
                                scrollEnabled={false}
                                onChangeText={setPreset}
                                multiline={true}
                                value={preset}
                                placeholder={"Enter here ..."} />

                            <Button
                                title={"Save"}
                                textColor={'white'}
                                style={{ margin: 10, marginTop: 20, width: '100%' }}
                                backgroundColor={Colors.green}
                                onPress={submit} />
                        </View>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={onClose}
                            style={styles.cancelBox}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </ReactNativeModal>
        </View>
    );
}