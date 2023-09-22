import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'

//  amount, change, bill, 
//  isReady, name, isManager

export default function GroupListMember({ Change, IsReady, Name, IsManager }) {
    // ? Maybe add Bill & Amount

    return (

        <View style={styles.rowContainer}>
            <Text style={styles.cell}>{Name}</Text>
            <Text style={styles.cell}>{Change}</Text>
            <Text style={styles.cell}>{(IsManager ? 'מנהל' : 'לא מנהל')}</Text>
            <Text style={styles.cell}>{(IsReady ? 'מוכן' : 'לא מוכן')}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-evenly',
        marginTop: 15,
        backgroundColor: 'lightgray'
    },
    cell: {
        backgroundColor: 'lightblue',
        color: 'black'
    }
})