import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';
import { GetUserId } from '../../utils/storage';

export default function SomeoneOwesYou({ Debtors }) {
    const navigation = useNavigation();

    useEffect(() => {
        console.log("someone owes you!", Debtors)

    }, [])

    async function HandleFinished() {
        navigation.navigate('home');
        socket.emit('leaveGroup', await GetUserId());
    }


    return (
        <View>
            <Text>זה וזה חייבים לך כסף</Text>
            {
                <FlatList
                    data={Debtors}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                        <Text>{index}: {item.deb.username} {item.amount}</Text>
                        // <GroupListMember
                        //     Index={index}
                        //     key={item.id}
                        //     Name={item.username}
                        //     Change={item.change}
                        //     Bill={item.bill}
                        //     Amount={item.amount}
                        //     IsReady={item.is_ready}
                        //     IsManager={item.is_manager}
                        // />
                    )}
                />
                // Debtors.map((debtor, i) => {
                //     return (<Text>{debtor.debt_amount} {debtor.username}</Text>)
                // })

            }
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