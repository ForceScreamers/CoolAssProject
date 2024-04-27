import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';
import InDebtListDisplay from './InDebtListDisplay';
import { GetUserId } from '../../utils/storage';
import useAsyncEffect from 'use-async-effect'


export default function LeftoverChangePayForSomeone({ GroupList, SetDebtors }) {

    const [inDebtList, setInDebtList] = useState([]);
    const [leftoverChange, setLeftoverChange] = useState(0)


    const navigation = useNavigation()

    useEffect(() => {
        socket.on('someoneOwesYou', debtors => {
            SetDebtors(debtors);

            navigation.navigate('someoneOwesYou');
        })
    }, [socket])


    // TODO: Update group needs to update without alerting to rejoin the group!!!!
    function GetUsersInDebt(group) {
        //Get all users with negative change

        let usersInDebt: { username: string, missingAmount: number, canPayFor: boolean, doneWithLeftover: boolean, id: string }[] = []

        group.forEach((user) => {

            if (user.change < 0) {
                usersInDebt.push({
                    username: user.username,
                    missingAmount: Math.abs(user.change),
                    canPayFor: leftoverChange - Math.abs(user.change) >= 0 ? true : false,
                    doneWithLeftover: user.done_with_leftover,
                    id: user._id
                })
            }
        })

        return usersInDebt;
    }

    function IsDoneWithPayment() {
        let usersInDebt = GetUsersInDebt(GroupList);

        usersInDebt.forEach(user => {
            if (user.canPayFor) {
                return false;
            }
        })
        return true;
    }

    async function GetLeftoverChange(group) {
        let selfId = await GetUserId();
        let selfChange = 0;
        group.forEach(user => {
            if (user._id === selfId) {
                selfChange = user.change
            }
        })
        return selfChange;
    }

    useAsyncEffect(async () => {
        //  First, update self change 
        setLeftoverChange(await GetLeftoverChange(GroupList))

    }, [GroupList])

    useAsyncEffect(async () => {
        //  Then, update the users in debt list, according to the leftover change
        setInDebtList(await GetUsersInDebt(GroupList));

        //  Every payment for someone, check if user is done
        if (IsDoneWithPayment()) {
            socket.emit('doneWithPayment', { userId: await GetUserId() })
        }

    }, [leftoverChange])


    async function DoneWithLeftover() {
        socket.emit('doneWithLeftover', { userId: await GetUserId() })
    }

    return (
        <View style={{ flex: 1 }}>
            <Text>נשאר לך עודף, תשלים למישהו</Text>
            <Text>{leftoverChange}</Text>
            <InDebtListDisplay
                InDebtList={inDebtList}
            />

            <Button title="סיים" onPress={DoneWithLeftover} />
        </View>

    )
}