import { View, Text, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

import { socket } from '../socket'
import GoBackButton from '../components/GoBackButton';
import { useNavigation } from '@react-navigation/native';

export default function JoinEvent() {
    const [input, setInput] = useState('');
    const navigation = useNavigation();

    function RequestJoinGroup() {
        socket.emit('canJoinGroup', {
            groupId: parseInt(input)
        })
    }

    useEffect(() => {
        socket.on('joinedGroup', () => {
            navigation.navigate('payment');
        })
        socket.on('groupNotFound', () => {
            alert('לא נמצאה קבוצה');
        })

        return () => {
            socket.off('joinedGroup');
            socket.off('groupNotFound');
        }
    }, [socket])


    return (
        <View>
            <GoBackButton />

            <TextInput
                onChangeText={input => setInput(input)}
                placeholderTextColor={'#7F7F7F'}
                underlineColorAndroid={'#70AD47'}
            />
            <Button onPress={RequestJoinGroup} title="join group" />

        </View>
    )
}