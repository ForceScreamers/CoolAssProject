import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { socket } from '../../utils/socket';
import { GetUserId } from '../../utils/storage';

export default function MissingAmount({ MissingAmount }) {
    const navigation = useNavigation();

    useEffect(() => {

        socket.on('paymentPayedFor', data => {
            // TODO: set you owe someone and display
            navigation.navigate('youOweSomeone');

            // let creditor = data.creditor
            console.log("You owe to!", data.creditor)
        })
    }, [socket])

    useFocusEffect(() => {
        // GetUserId().then((id) => {
        //     socket.emit('missingAmount', id);
        // })
    })

    return (
        <View>
            <Text>חסר לך כסף, חכה שישלימו לך... {MissingAmount}</Text>

        </View>
    )
}