import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';

export default function SomeoneOwesYou({ Debtors }) {
    const navigation = useNavigation()



    useEffect(() => {
        console.log("someone owes you!", Debtors)

    }, [Debtors])


    return (
        <View>
            <Text>זה וזה חייבים לך כסף</Text>
            {
                <FlatList
                    data={Debtors}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => (
                        <Text>{item.username} {item.debt}</Text>
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
        </View>
    )
}