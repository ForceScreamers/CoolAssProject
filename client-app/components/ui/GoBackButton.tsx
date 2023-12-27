import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
//? Pass go back function to children with a check if can go back
export default function GoBackButton() {
    const navigation = useNavigation()

    function GoBackIfCan() {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }

    return (
        <Button title="חזור" onPress={GoBackIfCan} />
    )
}