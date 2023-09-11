import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native'
import Calculator from './Calculator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Payment from './pages/Payment';

import { socket } from './socket'

const Stack = createNativeStackNavigator();

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
        <Payment />
        // <NavigationContainer>
        //     {/* <Calculator /> */}
        //     <Stack.Navigator>
        //         <Stack.Screen
        //             name="Register"
        //             component={RegisterPage}
        //         // options={{ title: 'Welcome' }}
        //         />
        //         <Stack.Screen name="friends" component={FriendsPage} />
        //     </Stack.Navigator>
        // </NavigationContainer>
    )
};

export default App;