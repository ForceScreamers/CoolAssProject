import { View, Text, FlatList, Button, StyleSheet, Pressable, Keyboard, Alert, BackHandler } from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import PaymentInput from './PaymentInput'
import DisplayGroupList from './GroupList'
import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { socket } from '../../utils/socket';

//TODO: Update total bill + tip while typing
//TODO: Change layout for manager and normal user

export default function Payment({ GroupList, IsManager, GroupCode, SetMissingAmount, SetInDebtList }) {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const navigation = useNavigation();

    function LeaveGroup() {
        socket.emit('leaveGroup');
        navigation.navigate('home');
    }

    useEffect(() => {
        socket.on('paymentNoChange', () => {
            navigation.navigate('noChange')
        })
        socket.on('paymentMissingAmount', (missingAmount) => {
            //TODO: display missing amount
            SetMissingAmount(missingAmount)
            navigation.navigate('missingAmount')
        })
        socket.on('leftoverChange', change => {
            console.log(change)//TODO: show leftover change
            navigation.navigate('leftoverChange')
        })
        socket.on('paymentLeftoverChangePayForSomeone', () => {
            //TODO: Show who can you pay for and a button to pay for them
            navigation.navigate('leftoverChangePayForSomeone')
        })
        socket.on('updateUserInDebt', usersInDebt => {
            SetInDebtList(usersInDebt)

        })
    }, [socket])

    useFocusEffect(() => {
        const backAction = () => {
            Alert.alert('רגע!', 'האם אתה רוצה להתנתק מהקבוצה?', [
                {
                    text: 'ביטול',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'אישור', onPress: () => LeaveGroup() },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    });

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
        if (index === 0) {
            Keyboard.dismiss();
            setIsBottomSheetOpen(false);
        }
        else if (index == 1) {
            setIsBottomSheetOpen(true)
        }
    }, []);

    useEffect(() => {
        console.log('open?', isBottomSheetOpen);

    }, [isBottomSheetOpen])



    function Expand() {
        bottomSheetRef.current?.expand();
    }

    function CollapseSheet() {
        bottomSheetRef.current?.collapse();
    }


    return (
        <View style={{ flex: 1 }}>

            <Text>{IsManager ? `קוד הצטרפות: ${GroupCode}` : ''}</Text>

            <View style={{ flex: 1 }}>

                <DisplayGroupList GroupList={GroupList} />
            </View>


            <BottomSheet
                style={styles.bottomSheet}
                backgroundStyle={{ backgroundColor: 'black' }}
                ref={bottomSheetRef}
                index={0}
                snapPoints={['10%', '60%']}
                onChange={handleSheetChanges}
                // handleStyle={{   }}
                handleIndicatorStyle={{ backgroundColor: 'white' }}

            >
                <Pressable onPress={Expand} >
                    <Text>שלם</Text>
                </Pressable>
                <PaymentInput
                    IsManager={IsManager}
                    CollapseSheet={CollapseSheet}
                    IsBottomSheetOpen={isBottomSheetOpen}
                />
            </BottomSheet>

        </View>
    )
}

const styles = StyleSheet.create({
    bottomSheet: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})