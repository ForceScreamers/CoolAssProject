import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import GoBackButton from '../components/GoBackButton'
import helper from '../../server/database/helper'
import { socket } from '../socket'
import { GetUserId } from '../storage'

export default function EditDisplayName() {
    // TODO: Validate name (without special characters and stuff)
    const MAX_NAME_LENGTH = 30
    const [displayName, setDisplayName] = useState('')


    async function UpdateDisplayName() {
        // Update username in database
        socket.emit('updateUsername', { userId: await GetUserId(), username: displayName })
    }

    return (
        <View>
            <GoBackButton />
            <Text>איך אתה רוצה שייקראו לך?</Text>
            <TextInput

                // style={[styles.textField, { fontSize: InputSize }]}
                maxLength={MAX_NAME_LENGTH}
                onChangeText={input => setDisplayName(input)}
                placeholder={"משהו יצירתי..."}
                placeholderTextColor={'#7F7F7F'}
                underlineColorAndroid={'#00FF00'}
            />
            <Button title="אישור" onPress={UpdateDisplayName} />
        </View>
    )
}