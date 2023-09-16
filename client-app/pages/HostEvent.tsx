import { View, Text, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { socket } from '../socket'
import GroupList from '../components/GroupList';

export default function HostEvent() {
    const [input, setInput] = useState('');
    const [groupList, setGroupList] = useState([]);

    const navigation = useNavigation();


    useEffect(() => {
        socket.on('updateGroup', data => {
            // console.log(data.groupData)
            let parsedData = JSON.parse(data)
            console.log(parsedData)
            setGroupList(parsedData.groupData)
        })

        return () => {
            socket.off('updateGroup')
        }
    }, [socket])


    useEffect(() => {
        console.log(groupList[0])
    }, [groupList])


    function RequestCreateGroup() {
        socket.emit('createGroup');
    }

    function RequestJoinGroup() {
        socket.emit('joinGroup', {
            groupId: parseInt(input)
        })

    }

    return (
        <View>

            <Text>HostEvent</Text>
            <Button onPress={() => navigation.navigate('payment')} title="a" />
            <Button onPress={RequestCreateGroup} title="create group" />
            <TextInput
                onChangeText={input => setInput(input)}
                placeholderTextColor={'#7F7F7F'}
                underlineColorAndroid={'#70AD47'}
            />
            <Button onPress={RequestJoinGroup} title="join group" />

            <View>
                <Text>hello!</Text>
                <GroupList Members={groupList} />
            </View>
        </View>
    )
}