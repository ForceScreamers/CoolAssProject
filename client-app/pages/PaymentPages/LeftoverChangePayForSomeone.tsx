import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';
import InDebtListDisplay from './InDebtListDisplay';
import { GetUserId } from '../../utils/storage';

export default function LeftoverChangePayForSomeone({ GroupList }) {

    const [inDebtList, setInDebtList] = useState([]);
    const [leftoverChange, setLeftoverChange] = useState(0)

    const navigation = useNavigation()
    // TODO: Navigation from screen to screen is via emits from the server
    useEffect(() => {
        socket.on('paymentPayedFor', data => {
            // TODO: data: who owes you and how much
            navigation.navigate('youOweSomeone');

        })
    }, [socket])

    // TODO: Update group needs to update without alerting to rejoin the group!!!!
    async function GetUsersInDebt(group) {
        //Get all users with negative change
        console.log("🚀 ~ file: LeftoverChangePayForSomeone.tsx:11 ~ LeftoverChangePayForSomeone ~ inDebtList:", inDebtList)


        let usersInDebt: { username: string, missingAmount: number, canPayFor: boolean, doneWithPayment: boolean, id: string }[] = []
        group.forEach((user) => {

            if (user.change < 0) {
                usersInDebt.push({
                    username: user.username,
                    missingAmount: Math.abs(user.change),
                    canPayFor: leftoverChange - Math.abs(user.change) >= 0 ? true : false,
                    doneWithPayment: user.done_with_payment,
                    id: user._id
                })
            }
        })


        return usersInDebt;
    }

    async function ExtractLeftoverChange(group) {
        let selfId = await GetUserId();
        let selfChange = 0;
        group.forEach(user => {
            if (user._id === selfId) {
                selfChange = user.change
            }
        })
        return selfChange;
    }

    //  First, update self change 
    useEffect(() => {
        async function UpdateLeftoverChange() {
            setLeftoverChange(await ExtractLeftoverChange(GroupList))
        }
        UpdateLeftoverChange()
        // TODO! complete pay for someone button
    }, [GroupList])

    //  Then, update the in debt list, according to the self change
    useEffect(() => {
        async function UpdateUsersInDebt() {
            setInDebtList(await GetUsersInDebt(GroupList))
        }
        UpdateUsersInDebt()
    }, [leftoverChange])

    return (
        <View style={{ flex: 1 }}>
            <Text>נשאר לך עודף, תשלים למישהו</Text>
            <Text>{leftoverChange}</Text>
            <InDebtListDisplay
                InDebtList={inDebtList}
            />
        </View>

    )
}