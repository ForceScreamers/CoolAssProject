import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

//  amount, change, bill, 
//  isReady, name, isManager

export default function GroupListMember({ Amount, Change, Bill, IsReady, Name, IsManager }) {
    return (
        <View>
            <View style={styles.rowContainer}>
                <Text style={styles.cell}>{Name}</Text>
                <Text style={styles.cell}>{Amount}</Text>
                <Text style={styles.cell}>{Change}</Text>
                <Text style={styles.cell}>{Bill}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-evenly',
        marginTop: 15,
    },
    cell: {
        backgroundColor: 'lightblue'
    }
})