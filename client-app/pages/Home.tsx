import { View, Text, Button, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '../socket';
import { GetUserId } from '../storage';
import ShowReconnectAlert from '../components/ShowReconnectAlert.tsx';

export default function Home({ IsConnected }) {
    const navigation = useNavigation();


    // useEffect(() => {
    //     navigation.navigate('editDisplayName')
    // }, [])

    useEffect(() => {
        // TODO: Prompt only if the user is in a group!
        async function ReconnectUser() {
            socket.emit('userReconnect', await GetUserId(), () => {
                navigation.navigate('payment')
            });
        }

        async function LeaveGroup() {
            socket.emit('leaveGroup', await GetUserId())
            console.log("leaving group...")
        }

        async function CheckReconnection() {
            socket.emit('isInAnyGroup', await GetUserId(), () => {
                ShowReconnectAlert(ReconnectUser, LeaveGroup)

            })
        }

        CheckReconnection()
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