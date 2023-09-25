import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function Home() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>בית</Text>
            <Button onPress={() => navigation.navigate('hostEvent')} title="צור אירוע" />
            <Button onPress={() => navigation.navigate('joinEvent')} title="הצטרף לאירוע" />
        </View>
    )
}