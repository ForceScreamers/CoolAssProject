import React from "react"
import { View, Text, StyleSheet, Image } from 'react-native'


export default function GroupListHeaders({ }) {
    return (

        <View style={styles.rowContainer}>
            <Text style={styles.cell}>|</Text>
            <Text style={styles.cell}>aaaa</Text>
            <Text style={styles.cell}>|</Text>
            <Text style={styles.cell}>aaaa</Text>
            <Text style={styles.cell}>|</Text>
            <Text style={styles.cell}>bbbb</Text>
            <Text style={styles.cell}>|</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 15,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        height: 55,
    },
    cell: {
        color: 'black',
        borderRadius: 2,
        padding: 10,
        textAlignVertical: 'center',
        fontSize: 20,
    },
    icon: {
        width: 25,
        height: 25,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    crownAndNameContainer: {
        flexDirection: 'row',
        minWidth: '20%',
        maxWidth: '25%',
        overflow: 'visible'
    }
})