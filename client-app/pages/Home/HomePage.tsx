import { View, Text, Button, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '../../utils/socket';
import { GetUserId } from '../../utils/storage';
import ShowReconnectAlert from './ShowReconnectAlert.tsx';

export default function Home({ IsConnected }) {
    const navigation = useNavigation();


    useEffect(() => {
        async function ReconnectUser() {
            socket.emit('userReconnect', await GetUserId(), () => {
                navigation.navigate('payment')
            });
        }

        async function LeaveGroup() {
            console.log("🚀 ~ file: HomePage.tsx:22 ~ await GetUserId():", await GetUserId())
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