import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { socket } from '../socket';


const blueColor = "#7AD1F0";
const blackColor = "#101119";
const whiteColor = "#F4FAFF";
const greenColor = "#61E786";






export default function Payment() {
    const [amount, setAmount] = useState(0);

    useEffect(() => {

    }, [])


    //! Change ip to the current computer that's running the server
    async function CalculateChange() {
        socket.emit('calculate', {
            amount: amount
        });
        // axios({
        //     url: 'http://192.168.14.187:3000',
        //     method: 'get',
        //     // baseURL: '',
        //     data: 20
        // }).catch((res) => {
        //     console.log(JSON.stringify(res, null, 2))
        // })
        console.log("Request to server")
    }

    function HandleUserInput(input: string) {
        let parsedInput = Number(input);

        if (!isNaN(parsedInput)) {
            setAmount(parsedInput)
        }
    }

    return (
        <View style={styles.title}>
            <Text style={styles.titleText}>תשלום</Text>

            <Text style={styles.titleText}>כמה אני משלם?</Text>
            <TextInput style={styles.textField} keyboardType='numeric' maxLength={10} />

            <Text style={styles.titleText}>כמה כסף יש לי?</Text>
            <TextInput
                style={styles.textField}
                keyboardType='numeric'
                maxLength={10}
                onChangeText={input => HandleUserInput(input)}// TODO: Add numeric validation
            />

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

