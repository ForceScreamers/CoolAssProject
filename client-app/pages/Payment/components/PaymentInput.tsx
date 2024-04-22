import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, Pressable } from 'react-native';
import { socket } from '../../../utils/socket';
import UserInputAndTitle from '../../../components/ui/UserInputAndTitle';
import TipInputAndDisplay from './TipInputAndDisplay';
import { GetUserId } from '../../../utils/storage';

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

export default function PaymentInput({ IsManager, CollapseSheet, IsBottomSheetOpen }) {
    const [amount, setAmount] = useState(-1);
    const [bill, setBill] = useState('');


    const [amountFieldColor, setAmountFieldColor] = useState(NORMAL_COLOR)
    const [billFieldColor, setBillFieldColor] = useState(NORMAL_COLOR)

    const [managerTipValue, setTipValue] = useState(0);

    const [tipFieldColor, setTipFieldColor] = useState(NORMAL_COLOR);

    async function ConfirmPayment() {
        //  Validate money input.
        let amountValid = IsNumberValid(amount);
        let billValid = IsNumberValid(bill);

        setAmountFieldColor(amountValid ? NORMAL_COLOR : ERROR_COLOR);
        setBillFieldColor(billValid ? NORMAL_COLOR : ERROR_COLOR);

        if (IsManager) {
            let tipValid = IsNumberValid(managerTipValue);

            setTipFieldColor(tipValid ? NORMAL_COLOR : ERROR_COLOR)
        }

        let userId = await GetUserId();

        if (amountValid && billValid) {
            CollapseSheet();
        }

        if (amountValid && billValid) {

            socket.emit('userReady', {
                userId: userId,
                payment: {
                    amount: amount,
                    bill: bill,
                    tip: managerTipValue
                }
            });
        }
        else {
            console.log("not ready!")
            socket.emit('userNotReady', userId);
        }
    }

    useEffect(() => {
        async function EmitNotReady() { socket.emit('userNotReady', await GetUserId()); }

        if (IsBottomSheetOpen === false) {
            ConfirmPayment()
        } else {
            EmitNotReady()
        }
    }, [IsBottomSheetOpen])


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
                    FieldColor={tipFieldColor}
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