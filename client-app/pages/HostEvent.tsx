import { View, Text, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { socket } from '../socket'
import GroupList from '../components/GroupList';
import GoBackButton from '../components/GoBackButton';

export default function HostEvent() {

    const navigation = useNavigation();








    function RequestCreateGroup() {
        socket.emit('createGroup');
    }


    return (
        <View style={{ flex: 1 }}>
            <GoBackButton />

            <Text>יצירת אירוע</Text>
            <Button onPress={RequestCreateGroup} title="create group" />



            <Button onPress={() => navigation.navigate('payment')} title="צור אירוע" />
        </View>
    )
}