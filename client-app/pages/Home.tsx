import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Home({ IsConnected }) {
    const navigation = useNavigation();


    // useEffect(() => {
    //     navigation.navigate('editDisplayName')
    // }, [])

    useEffect(() => {
        if (IsConnected) {
            //  Handle reconnect
            // navigation.navigate('')
            // socket.emit('userReconnect');
        }
    }, [IsConnected])



    return (
        <View>
            <Text>בית</Text>
            <Button onPress={() => navigation.navigate('editDisplayName')} title="שנה שם" />
            <Button onPress={() => navigation.navigate('hostEvent')} title="צור אירוע" />
            <Button onPress={() => navigation.navigate('joinEvent')} title="הצטרף לאירוע" />
            <Button onPress={() => AsyncStorage.removeItem('user-id')} title="del id" />
        </View>
    )
}