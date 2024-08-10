import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { socket } from '../../utils/socket';
import { GetUserId } from '../../utils/storage';

export default function NoChange() {
    // TODO: Disable going back when finished with payment
    const navigation = useNavigation()

    async function HandleFinished() {
        navigation.navigate('home');
        socket.emit('leaveGroup', await GetUserId());
    }

    return (
        <View>
            <Text>שילמת בול! אין עודף</Text>
            <View style={styles.buttonContainer} >
                <Pressable style={styles.button} onPress={HandleFinished}>
                    <Text style={styles.buttonText}>סיימתי!</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    buttonText: {
        fontSize: 35,
        color: 'black'
    },
    buttonContainer: {
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#70AD47',
        borderWidth: 1,
    }
})