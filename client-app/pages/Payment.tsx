import { View, Text, FlatList, Button, StyleSheet, Pressable, Keyboard, Alert, BackHandler } from 'react-native'
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import PaymentInput from './PaymentInput'
import GroupList from '../components/GroupList'
import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';
import { socket } from '../socket';

//TODO: Update total bill + tip while typing
//TODO: Update all users when confirming payment
//TODO: Change layout for manager and normal user

export default function Payment({ GroupData, IsManager, GroupCode }) {
    const [isReady, setIsReady] = useState(false);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const navigation = useNavigation();

    function LeaveGroup() {
        socket.emit('leaveGroup');
        navigation.navigate('home');
    }

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
            setIsReady(true);
        }
        else if (index == 1) {
            setIsReady(false)
        }
    }, []);


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

                <GroupList Members={GroupData} />
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
                <PaymentInput IsManager={IsManager} IsReady={isReady} CollapseSheet={CollapseSheet} />
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