import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';

export default function LeftoverChangePayForSomeone() {
    const navigation = useNavigation()
    // TODO: Navigation from screen to screen is via emits from the server
    useEffect(() => {
        socket.on('paymentPayedFor', data => {
            // TODO: data: who owes you and how much
            navigation.navigate('youOweSomeone');

        })
    }, [socket])

    return (
        <View>
            <Text>נשאר לך עודף, תשלים למישהו</Text>
        </View>

    )
}