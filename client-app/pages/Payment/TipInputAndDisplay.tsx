import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import UserInputAndTitle from '../../components/ui/UserInputAndTitle'

export default function TipInputAndDisplay({ IsManager, SetTip, TipValue }) {
    return (
        <View style={styles.tipContainer}>
            <Text style={{ textAlign: 'center' }}>סה"כ כולל טיפ</Text>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>

                <TextInput
                    style={styles.billAndTipField}
                    maxLength={10}
                    editable={false}
                    placeholder='₪0.00'
                    placeholderTextColor={'#000000'}
                />
                {
                    IsManager ?
                        <UserInputAndTitle
                            TitleSize={0}
                            InputSize={20}
                            StateValue={TipValue}
                            SetState={SetTip}
                            Title=''
                            MaxLength={2}
                            Type='numeric'
                            PlaceHolder='0%'
                        />
                        :
                        <Text style={styles.tipText}>(20%)</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    tipContainer: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    billAndTipField: {
        fontSize: 35,
        color: 'white',
        height: 60,
        margin: 10,
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

})