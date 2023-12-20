import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { socket } from '../socket';
import UserInputAndTitle from '../components/UserInputAndTitle';
import TipInputAndDisplay from '../components/TipInputAndDisplay';

const ERROR_COLOR = '#FF0000'
const NORMAL_COLOR = '#70AD47'

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function IsNumberValid(input) {
    if (isNumeric(input) && input !== '' && input >= 0) {
        return true;
    }
    return false;
}

export default function PaymentInput({ IsManager, CollapseSheet }) {
    const [amount, setAmount] = useState(-1);
    const [bill, setBill] = useState('');

    const [managerTipValue, setTipValue] = useState(0);

    const [amountFieldColor, setAmountFieldColor] = useState(NORMAL_COLOR)
    const [billFieldColor, setBillFieldColor] = useState(NORMAL_COLOR)

    function ConfirmPayment() {
        //  Validate money input.
        let amountValid = IsNumberValid(amount);
        let billValid = IsNumberValid(bill);

        setAmountFieldColor(amountValid ? NORMAL_COLOR : ERROR_COLOR);
        setBillFieldColor(billValid ? NORMAL_COLOR : ERROR_COLOR);

        if (amountValid && billValid) {
            CollapseSheet();

            socket.emit('userReady', {
                amount: amount,
                bill: bill,
                tip: managerTipValue,
            });
        }
        else {
            socket.emit('userNotReady');
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

                        FieldColor={billFieldColor}
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

                        FieldColor={amountFieldColor}
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