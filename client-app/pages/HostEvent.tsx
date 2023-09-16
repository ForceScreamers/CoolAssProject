import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

import { socket } from '../socket'

export default function HostEvent() {

    const navigation = useNavigation();

    function RequestCreateGroup() {
        socket.emit('createGroup');
    }

    return (
        <View>

            <Text>HostEvent</Text>
            <Button onPress={() => navigation.navigate('payment')} title="a" />
            <Button onPress={RequestCreateGroup} title="create group" />
        </View>
    )
}