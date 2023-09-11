import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native'
import Calculator from './Calculator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import FriendsPage from './pages/FriendsPage';
import Payment from './pages/Payment';

const Stack = createNativeStackNavigator();



const App = () => {
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