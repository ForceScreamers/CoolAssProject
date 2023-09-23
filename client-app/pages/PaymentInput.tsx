import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { socket } from '../socket';
import UserInputAndTitle from '../components/UserInputAndTitle';
import TipInputAndDisplay from '../components/TipInputAndDisplay';


export default function PaymentInput({ IsManager }) {
    const [amount, setAmount] = useState(0);
    const [bill, setBill] = useState(0);

    const [tipValue, setTipValue] = useState(0);


    //! Change ip to the current computer that's running the server
    function CalculateChange() {
        socket.emit('calculate', {
            amount: amount,
            bill: bill,
            tip: tipValue
        });
        console.log("Request to server")
    }

    return (
        <View style={styles.mainContainer}>
            <Text>האירוע שלי</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.inputs}>
                    <UserInputAndTitle
                        TitleSize={25}
                        InputSize={25}

                        StateValue={bill}
                        SetState={setBill}
                        Title='כמה אני חייב'
                        MaxLength={10}
                        Type='numeric'
                        PlaceHolder='₪0.00'
                    />
                    <UserInputAndTitle
                        TitleSize={25}
                        InputSize={25}

                        StateValue={amount}
                        SetState={setAmount}
                        Title='כמה משלם בפועל'
                        MaxLength={10}
                        Type='numeric'
                        PlaceHolder='₪0.00'
                    />
                </View>

                <TipInputAndDisplay
                    IsManager={IsManager}
                    SetTip={setTipValue}
                    TipValue={tipValue}
                />

            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={CalculateChange} style={styles.button}>
                    <Text style={styles.buttonText}>אישור</Text>
                </Pressable>
            </View>

        </View>
    )
}

const DEFAULT_FONT_FAMILY = ''

const styles = StyleSheet.create({
    inputs: {
        // marginRight: '10%',
    },

    mainContainer: {
        flexDirection: 'column',
        flex: 1,
        // marginTop: 100,
        height: '100%',
    },
    buttonText: {
        fontSize: 35,
        color: 'black'
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