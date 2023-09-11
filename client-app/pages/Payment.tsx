import axios from 'axios';
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';

const blueColor = "#7AD1F0";
const blackColor = "#101119";
const whiteColor = "#F4FAFF";
const greenColor = "#61E786";

async function CalculateChange() {
    axios({
        url: 'http://192.168.94.213:3000',
        method: 'get',
        // baseURL: '',
        data: 20
    }).catch((res) => {
        console.log(JSON.stringify(res, null, 2))
    })
    console.log("Request to server")
}

export default function Payment() {

    useEffect(() => {

    }, [])


    return (
        <View style={styles.title}>
            <Text style={styles.titleText}>תשלום</Text>

            <Text style={styles.titleText}>כמה אני משלם?</Text>
            <TextInput style={styles.textField} keyboardType='numeric' maxLength={10} />

            <Text style={styles.titleText}>כמה כסף יש לי?</Text>
            <TextInput style={styles.textField} keyboardType='numeric' maxLength={10} />

            <Pressable onPress={CalculateChange} style={styles.button}>
                <Text style={styles.buttonText}>אישור</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        alignItems: 'center',
        marginTop: 140
    },
    buttonText: {
        fontSize: 30,
        color: blackColor
    },
    titleText: {
        fontSize: 30,
        color: whiteColor
    },
    textField: {
        backgroundColor: whiteColor,
        fontSize: 30,
        color: blackColor,
        height: 70,
        margin: 20,
        width: 150,
        borderWidth: 1,
        padding: 10,
        borderColor: blueColor,
        borderRadius: 5,

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: blueColor,
        // borderColor: '#FFFFFF',
        borderWidth: 1,
    }
})

