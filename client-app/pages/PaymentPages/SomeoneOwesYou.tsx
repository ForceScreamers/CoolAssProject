import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';

export default function SomeoneOwesYou({ Debtors }) {
    const navigation = useNavigation()



    useEffect(() => {
        console.log("someone owes you!", Debtors)

    }, [Debtors])


    return (
        <View>
            <Text>זה וזה חייבים לך כסף</Text>
            {
                Debtors.map((debtor, i) => {
                    return (<Text>{debtor.debt_amount} {debtor.username}</Text>)
                })
            }
        </View>
    )
}