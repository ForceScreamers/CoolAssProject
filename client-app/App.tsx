import 'react-native-gesture-handler'
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { NavigationContainer, useNavigation } from '@react-navigation/native'
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

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['app://']
}

const App = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [groupList, setGroupList] = useState([]);
    // const [userId, setUserId] = useState('')


    const [groupCode, setGroupCode] = useState('');
    const [isManager, setIsManager] = useState(false);//* There is also a manager prop in the user on server for redundency

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
            setGroupList(JSON.parse(data));
            setIsManager(false);
        })

        socket.on('createdGroup', data => {
            setGroupCode(data.groupCode);
            setIsManager(true);
            console.log(data);
        })

        socket.on('updatedGroup', data => {
            setGroupList(data)
        })



        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);

            socket.off('joinedGroup');
        }
    }, [socket])


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer linking={linking} >

                <Stack.Navigator initialRouteName='home' screenOptions={{ animation: 'fade', headerShown: false, contentStyle: { backgroundColor: '#606060' } }}>

                    <Stack.Screen name='home'>{() => <Home />}</Stack.Screen>

                    <Stack.Screen name='payment'>{() => <Payment GroupData={groupList} IsManager={isManager} GroupCode={groupCode} />}</Stack.Screen>
                    <Stack.Screen name='hostEvent'>{() => <HostEvent GroupCode={groupCode} />}</Stack.Screen>
                    <Stack.Screen name='joinEvent'>{() => <JoinEvent />}</Stack.Screen>

                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
};

export default App;