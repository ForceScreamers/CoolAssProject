import { View, Text, Alert } from 'react-native'
import React from 'react'

export default function ShowReconnectAlert(ReconnectUser, LeaveGroup) {

    Alert.alert(
        'אופס, נראה שהתנתקת בלי לעזוב את הקבוצה',
        undefined,
        [
            {
                text: 'יציאה מהקבוצה',
                onPress: () => LeaveGroup(),
                style: 'cancel',
            },
            {
                text: 'חזור לקבוצה',
                onPress: () => ReconnectUser(),
                style: 'cancel',
            },

        ],
        {
            cancelable: false
        }
    )
}