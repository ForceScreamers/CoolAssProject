import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { socket } from '../../utils/socket';

export default function MissingAmount({ MissingAmount }) {
    const navigation = useNavigation();

    useEffect(() => {
        socket.on('paymentPayedFor', data => {
            // TODO: data: who paid
            navigation.navigate('youOweSomeone');
        })
    }, [socket])


    return (
        <View>
            <Text>חסר לך כסף, חכה שישלימו לך... {MissingAmount}</Text>

        </View>
    )
}