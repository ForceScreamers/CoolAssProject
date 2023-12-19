import 'react-native-gesture-handler'
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native'
import Calculator from './Calculator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Linking, Alert, Button } from 'react-native';


//  Screens
import HostEvent from './pages/HostEvent';
import JoinEvent from './pages/JoinEvent';

import { socket } from './socket'
import Home from './pages/Home';
import Payment from './pages/Payment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditDisplayName from './pages/EditDisplayName';

import { StoreUserId } from './storage';
const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['app://']
}

// TODO: Add display name and edit display name. don't need a register or login because the users will join via link, not by request!
// TODO: if there is no name, ask the user to choose a name.


const App = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [groupList, setGroupList] = useState([]);


    const [groupCode, setGroupCode] = useState('');
    const [isManager, setIsManager] = useState(false);//* There is also a manager prop in the user on server for redundency



    useEffect(() => {
        // socket.emit('register', { username: "Yossi" })
    }, [])



    useEffect(() => {
        function onConnect() {

            setIsConnected(true);
        }

        function onDisconnect() {
            console.log("EEE")
            socket.emit('userDisconnect', "yaaa")
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on('joinedGroup', data => {
            setGroupList(JSON.parse(data));
            setIsManager(false);
        })

        socket.on('createdGroup', data => {
            setGroupCode(data.groupCode);
            setIsManager(true);
            // console.log(data);
        })

        socket.on('updatedGroup', data => {
            setGroupList(data)
        })

        socket.on('updateId', async data => {
            StoreUserId(data.userId)
            // console.log(await GetUserId())
        })



        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);

            socket.off('joinedGroup');
            // TODO Check what and how to use socket off
        }
    }, [socket])


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer linking={linking} >

                <Stack.Navigator initialRouteName='home' screenOptions={{ animation: 'fade', headerShown: false, contentStyle: { backgroundColor: '#606060' } }}>

                    <Stack.Screen name='home'>{() => <Home IsConnected={isConnected} />}</Stack.Screen>

                    <Stack.Screen name='payment'>{() =>
                        <Payment
                            GroupData={groupList}
                            IsManager={isManager}
                            GroupCode={groupCode}
                        />}</Stack.Screen>
                    <Stack.Screen name='hostEvent'>{() => <HostEvent GroupCode={groupCode} />}</Stack.Screen>
                    <Stack.Screen name='joinEvent'>{() => <JoinEvent />}</Stack.Screen>
                    <Stack.Screen name='editDisplayName'>{() => <EditDisplayName />}</Stack.Screen>

                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
};

export default App;