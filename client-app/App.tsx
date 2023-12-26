import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


//  Screens
import HostEvent from './pages/HostEvent';
import JoinEvent from './pages/JoinEvent';

import { socket } from './socket'
import Home from './pages/Home';
import Payment from './pages/Payment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditUsername from './pages/EditDisplayName';

import { GetUserId, StoreUserId } from './storage';
const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['app://']
}

enum Auth {
    Loading,
    HasId,
    NoId
}


// TODO: Encrypt client stored userId as token.

// TODO: Add page wrapper that shows menu with: profile details, settings, history...

const App = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [groupList, setGroupList] = useState([]);
    const [groupCode, setGroupCode] = useState('');
    const [isManager, setIsManager] = useState(false);//* There is also a manager prop in the user on server for redundency

    const [hasUserId, setHasUserId] = useState(Auth.Loading)




    useEffect(() => {
        async function onConnect() {
            let userId = await GetUserId();

            // If the id is null it means that the app is loaded for the first time
            if (userId == null) {
                setHasUserId(Auth.NoId)
            }
            else {
                setHasUserId(Auth.HasId)
            }
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on('updateId', async data => {
            StoreUserId(data.userId)
        })

        socket.on('joinedGroup', data => {
            setGroupList(JSON.parse(data));
            setIsManager(false);
        })

        socket.on('createdGroup', data => {
            setGroupCode(data.groupCode);
            setIsManager(true);
        })

        socket.on('updatedGroup', data => {
            setGroupList(data)
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
            <>
                {hasUserId !== Auth.Loading && (<NavigationContainer linking={linking} >

                    <Stack.Navigator initialRouteName={hasUserId === Auth.HasId ? "home" : "editDisplayName"} screenOptions={{ animation: 'fade', headerShown: false, contentStyle: { backgroundColor: '#606060' } }}>

                        <Stack.Screen name='home'>{() => <Home IsConnected={isConnected} />}</Stack.Screen>

                        <Stack.Screen name='payment'>{() =>
                            <Payment
                                GroupData={groupList}
                                IsManager={isManager}
                                GroupCode={groupCode}
                            />}</Stack.Screen>
                        <Stack.Screen name='hostEvent'>{() => <HostEvent GroupCode={groupCode} />}</Stack.Screen>
                        <Stack.Screen name='joinEvent'>{() => <JoinEvent />}</Stack.Screen>
                        <Stack.Screen name='editDisplayName'>{() => <EditUsername Auth={Auth} HasUserId={hasUserId} SetHasUserId={setHasUserId} />}</Stack.Screen>

                    </Stack.Navigator>
                </NavigationContainer>)}
            </>
        </GestureHandlerRootView>
    )
};

export default App;