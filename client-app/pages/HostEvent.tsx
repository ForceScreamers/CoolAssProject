import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function HostEvent() {

    const navigation = useNavigation();


    return (
        <View>
            <Text>HostEvent</Text>
            <Button onPress={() => navigation.navigate('payment')} title="a" />
        </View>
    )
}