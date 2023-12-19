import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: consider using a wrapper?
export async function StoreUserId(userId) {
    console.log(userId)
    try {
        await AsyncStorage.setItem('user-id', JSON.stringify(userId));
    } catch (e) {
        // saving error
        console.log(e)
    }
};

export async function GetUserId() {
    try {
        let value = JSON.parse(await AsyncStorage.getItem('user-id'));
        console.log(value)
        if (value !== null) {
            return value
        }
        else {
            console.log("cant resolve promise")
            return -1
        }
    } catch (e) {
        console.log(e)
    }
};