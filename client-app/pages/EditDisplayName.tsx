import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import GoBackButton from '../components/GoBackButton'
import { socket } from '../socket'
import { GetUserId } from '../storage'
import { useNavigation } from '@react-navigation/native'

export default function EditUsername({ Auth, HasUserId, SetHasUserId }) {

    const MAX_NAME_LENGTH = 30
    const [username, setUsername] = useState('')
    const navigation = useNavigation();


    async function UpdateUsername() {
        // First time updating username
        if (HasUserId === Auth.NoId) {

            socket.emit('createNewUser', { username: username }, () => {
                console.log('proceed to app!')

                // Proceed to app
                SetHasUserId(Auth.HasId)
                navigation.navigate('home')
            })
        }
        else if (HasUserId === Auth.HasId) {// Any other time 
            let userId = await GetUserId()
            socket.emit('updateUsername',
                {
                    userId: userId,
                    username: username
                })
        }
    }


    return (
        <View>
            <GoBackButton />
            <Text>איך אתה רוצה שייקראו לך?</Text>
            <TextInput

                // style={[styles.textField, { fontSize: InputSize }]}
                maxLength={MAX_NAME_LENGTH}
                onChangeText={input => setUsername(input)}
                placeholder={"משהו יצירתי..."}
                placeholderTextColor={'#7F7F7F'}
                underlineColorAndroid={'#00FF00'}
            />
            <Button title="אישור" onPress={UpdateUsername} />
        </View>
    )
}