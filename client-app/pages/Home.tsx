import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { socket } from '../socket';
export default function Home({ IsConnected }) {
    const navigation = useNavigation();

    useEffect(() => {
        if (IsConnected) {
            //  Handle reconnect
            navigation.navigate('home')
            socket.emit('userReconnect');
        }
    }, [IsConnected])

    return (
        <View>
            <Text>בית</Text>
            <Button onPress={() => navigation.navigate('editDisplayName')} title="שנה שם" />
            <Button onPress={() => navigation.navigate('hostEvent')} title="צור אירוע" />
            <Button onPress={() => navigation.navigate('joinEvent')} title="הצטרף לאירוע" />
        </View>
    )
}