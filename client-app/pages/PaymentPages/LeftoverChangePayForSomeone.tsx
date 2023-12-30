import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';
import InDebtListDisplay from './InDebtListDisplay';

export default function LeftoverChangePayForSomeone({ InDebtList }) {
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
            <InDebtListDisplay UsersInDebt={InDebtList} />
        </View>

    )
}