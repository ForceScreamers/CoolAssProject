import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { socket } from '../socket';
import GroupList from '../components/GroupList';



const tempMembers = [
    { amount: 80, bill: 500, change: 20, name: 'כפיר', id: 0, isManager: false },
    { amount: 80, bill: 500, change: 20, name: 'שלומי', id: 1 },
    { amount: 80, bill: 500, change: 20, name: 'בובספוג המרובע', id: 2 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 3 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 4 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 5 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 6 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 7 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 8 },
    { amount: 80, bill: 500, change: 20, name: 'לולולולו', id: 9 },
]


export default function Payment({ IsManager }) {
    const [amount, setAmount] = useState(0);
    const [bill, setBill] = useState(0);

    const [tipValue, setTipValue] = useState(0);


    useEffect(() => {

    }, [])


    //! Change ip to the current computer that's running the server
    function CalculateChange() {
        socket.emit('calculate', {
            amount: amount,
            bill: bill,
            tip: tipValue
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

    function HandleUserInput(input: string, setFunc) {
        let parsedInput = Number(input);

        if (!isNaN(parsedInput)) {
            setFunc(parsedInput)
        }
    }

    return (
        <View style={styles.mainContainer}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', marginTop: 120 }}>
                <View style={styles.inputs}>
                    <View >
                        <Text style={styles.titleText}>כמה אני חייב</Text>
                        <TextInput
                            style={styles.textField}
                            keyboardType='numeric'
                            maxLength={10}
                            onChangeText={input => HandleUserInput(input, setBill)}
                            placeholder='₪0.00'
                            placeholderTextColor={'#7F7F7F'}
                            underlineColorAndroid={'#70AD47'}
                        />
                    </View>

                    <View>
                        <Text style={styles.titleText}>כמה משלם בפועל</Text>
                        <TextInput
                            style={styles.textField}
                            keyboardType='numeric'
                            maxLength={10}
                            onChangeText={input => HandleUserInput(input, setAmount)}
                            placeholder='₪0.00'
                            placeholderTextColor={'#7F7F7F'}
                            underlineColorAndroid={'#70AD47'}
                        />


                    </View>
                </View>

                <View style={styles.tipContainer}>
                    <Text style={styles.titleText}>סה"כ כולל טיפ</Text>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline' }}>
                        <TextInput
                            style={styles.billAndTipField}
                            maxLength={10}
                            onChangeText={input => HandleUserInput(input, setAmount)}
                            editable={false}
                            placeholder='₪0.00'
                            placeholderTextColor={'#000000'}
                        />
                        {
                            IsManager ?
                                <Text style={styles.tipText}>(20%)</Text>
                                :
                                <TextInput
                                    style={styles.tipTextField}
                                    maxLength={3}
                                    onChangeText={input => HandleUserInput(input, setTipValue)}
                                    keyboardType='numeric'

                                    placeholder='0%'
                                    // placeholderTextColor={'#000000'}
                                    placeholderTextColor={'#7F7F7F'}
                                    underlineColorAndroid={'#70AD47'}
                                // value={tipDisplay}
                                />
                        }

                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={CalculateChange} style={styles.button}>
                    <Text style={styles.buttonText}>אישור</Text>
                </Pressable>
            </View>



            {/* <View style={{ flex: 1 }}>
                <GroupList Members={tempMembers} />
            </View> */}


        </View>
    )
}

const DEFAULT_FONT_FAMILY = ''

const styles = StyleSheet.create({
    inputs: {
        marginTop: 0,
    },
    tipTextField: {

    },
    billAndTipField: {

        fontSize: 35,
        color: 'white',
        height: 60,
        margin: 20,
        width: 130,
        padding: 0,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: '#70AD47',
    },
    tipText: {
        color: '#70AD47',
        fontSize: 20,
    },
    tipContainer: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    mainContainer: {
        flexDirection: 'column',
        flex: 1,
        // marginTop: 100,
        backgroundColor: '#606060',
        height: '100%',
    },
    buttonText: {
        fontSize: 35,
        color: 'black'
    },
    titleText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    textField: {
        fontSize: 35,
        color: 'white',
        height: 60,
        margin: 20,
        width: 130,
        borderWidth: 0,
        borderRadius: 5,
        textAlign: 'center',
    },
    buttonContainer: {
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#70AD47',
        borderWidth: 1,
    }
})

