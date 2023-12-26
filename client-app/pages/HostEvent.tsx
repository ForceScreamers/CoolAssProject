import { View, Text, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { socket } from '../socket'
import DisplayGroupList from '../components/GroupList';
import GoBackButton from '../components/GoBackButton';

export default function HostEvent({ GroupCode }) {

    const navigation = useNavigation();


    function RequestCreateGroup() {
        socket.emit('canCreateGroup');
    }

    useEffect(() => {
        socket.on('createdGroup', () => {
            navigation.navigate('payment');
        })
        socket.on('cantCreateGroup', () => {
            alert('לא ניתן ליצור קבוצה');
        })

        return () => {
            socket.off('joinedGroup');
            socket.off('cantCreateGroup');
        }
    }, [socket])

    return (
        <View style={{ flex: 1 }}>
            <GoBackButton />

            <Text>{GroupCode}</Text>

            <Button title='צור' onPress={RequestCreateGroup} />
        </View>
    )
}