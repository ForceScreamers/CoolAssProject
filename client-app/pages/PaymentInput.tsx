import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { socket } from '../socket';
import UserInputAndTitle from '../components/UserInputAndTitle';
import TipInputAndDisplay from '../components/TipInputAndDisplay';


export default function PaymentInput({ IsManager, IsReady, CollapseSheet }) {
    const [amount, setAmount] = useState('');
    const [bill, setBill] = useState('');

    const [managerTipValue, setTipValue] = useState(0);

    // TODO: Fix payment input validation!
    const [amountValid, setAmountValid] = useState(false)
    const [billValid, setBillValid] = useState(false)

    function ConfirmPayment() {
        console.log("amount", amount)
        setAmountValid(amount === '' ? false : true);
        setBillValid(bill === '' ? false : true);

        if (amountValid && billValid) {
            CollapseSheet();

            socket.emit('userReady', {
                amount: amount,
                bill: bill,
                tip: managerTipValue,
            });
            console.log("Request to server")
        }
    }

    return (

        <View style={styles.mainContainer}>
            <Text style={{ fontSize: 30, color: 'white' }}>האירוע שלי</Text>
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

                        ShowValidAlert={amountValid}
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

                        ShowValidAlert={billValid}
                    />
                </View>

                <TipInputAndDisplay
                    IsManager={IsManager}
                    SetTip={setTipValue}
                    TipValue={managerTipValue}
                />

            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={ConfirmPayment} style={styles.button}>
                    <Text style={styles.buttonText}>אישור</Text>
                </Pressable>
            </View>

        </View>

    )
}


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