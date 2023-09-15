import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native'
import Calculator from './Calculator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Linking, Alert, Button } from 'react-native';


//  Screens
import Payment from './pages/Payment';
import HostEvent from './pages/HostEvent';

import { socket } from './socket'

const Stack = createNativeStackNavigator();

//  TODO: Create a link that join the client to the matching group.
const linking = {
    prefixes: ['app://']
}

const App = () => {

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [])


    return (

        <NavigationContainer linking={linking} >

            <Stack.Navigator initialRouteName='hostEvent' screenOptions={{ headerShown: false }}>


                <Stack.Screen options={{}} name='payment'>{() => <Payment IsManager={false} />}</Stack.Screen>
                <Stack.Screen name='hostEvent'>{() => <HostEvent />}</Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>

    )
};

export default App;