import { View, Text, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

import { socket } from '../../utils/socket'
import GoBackButton from '../../components/ui/GoBackButton';
import { useNavigation } from '@react-navigation/native';
import { GetUserId } from '../../utils/storage';

export default function JoinEvent() {
    const [input, setInput] = useState('');
    const navigation = useNavigation();

    async function RequestJoinGroup() {
        socket.emit('requestJoinGroup', {
            userId: await GetUserId(),
            groupCode: parseInt(input)
        })
    }

    useEffect(() => {
        socket.on('joinedGroup', () => {
            console.log("Joining group")
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