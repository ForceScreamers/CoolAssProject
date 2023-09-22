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

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['app://']
}

const App = () => {

    const [isConnected, setIsConnected] = useState(socket.connected);

    const [groupList, setGroupList] = useState([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on('joinedGroup', data => {
            console.log("____________")


            setGroupList(JSON.parse(data).groupData);
        })



        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);

            socket.off('joinedGroup');
        }
    }, [socket])


    return (

        <NavigationContainer linking={linking} >

            <Stack.Navigator initialRouteName='home' screenOptions={{ animation: 'fade', headerShown: false, contentStyle: { backgroundColor: '#606060' } }}>

                <Stack.Screen name='home'>{() => <Home />}</Stack.Screen>

                <Stack.Screen name='payment'>{() => <Payment GroupData={groupList} />}</Stack.Screen>
                <Stack.Screen name='hostEvent'>{() => <HostEvent />}</Stack.Screen>
                <Stack.Screen name='joinEvent'>{() => <JoinEvent />}</Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>

    )
};

export default App;