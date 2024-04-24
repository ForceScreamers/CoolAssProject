import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { socket } from '../../utils/socket';
import { useNavigation } from '@react-navigation/native';
import InDebtListDisplay from './InDebtListDisplay';
import { GetUserId } from '../../utils/storage';

export default function LeftoverChangePayForSomeone({ GroupList, SetDebtors }) {

    const [inDebtList, setInDebtList] = useState([]);
    const [leftoverChange, setLeftoverChange] = useState(0)

    const [count, setCount] = useState(0);

    const navigation = useNavigation()

    useEffect(() => {
        setCount(count => count + 1);

        socket.on('someoneOwesYou', debtors => {
            SetDebtors(debtors);

            navigation.navigate('someoneOwesYou');
        })

        if (IsDoneWithPayment()) {
            console.log("going to someone owes you")
            navigation.navigate('someoneOwesYou');
        }
    }, [socket])

    useEffect(() => {
        // If done with payment, navigate to someone owes you
        console.log('count: ', count)
    }, [count])

    // TODO: Update group needs to update without alerting to rejoin the group!!!!
    function GetUsersInDebt(group) {
        //Get all users with negative change

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

    //  First, update self change 
    useEffect(() => {
        async function UpdateLeftoverChange() {
            setLeftoverChange(await GetLeftoverChange(GroupList))
        }
        UpdateLeftoverChange()
    }, [GroupList])

    //  Then, update the in debt list, according to the self change
    useEffect(() => {
        async function UpdateUsersInDebt() {
            if (IsDoneWithPayment()) {
                socket.emit('doneWithPayment', { userId: await GetUserId() })
            }

            setInDebtList(GetUsersInDebt(GroupList));
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