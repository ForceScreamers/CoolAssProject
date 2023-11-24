import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'

const ERROR_COLOR = '#FF0000'
const NORMAL_COLOR = '#70AD47'

export default function UserInputAndTitle({ TitleSize, InputSize, SetState, StateValue, Title, Type, MaxLength, PlaceHolder, ShowValidAlert, ...props }) {

    return (
        <View>
            <Text style={[styles.titleText, { fontSize: TitleSize }]}>{Title}</Text>
            <TextInput

                style={[styles.textField, { fontSize: InputSize }]}
                keyboardType={Type}
                maxLength={MaxLength}
                onChangeText={input => SetState(input)}
                placeholder={PlaceHolder}
                placeholderTextColor={'#7F7F7F'}
                underlineColorAndroid={ShowValidAlert ? NORMAL_COLOR : ERROR_COLOR}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    textField: {
        fontSize: 35,
        color: 'white',
        height: 60,
        margin: 5,
        width: '90%',
        borderWidth: 0,
        borderRadius: 5,
        textAlign: 'center',
    },
    titleText: {
        color: 'white',
        textAlign: 'center'
    },
})