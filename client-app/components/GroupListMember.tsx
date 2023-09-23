import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'

const checkImage = require('../assets/check.png')
const awaitingImage = require('../assets/awaiting.png')
const crownImage = require('../assets/crown.png')


export default function GroupListMember({ Change, IsReady, Name, IsManager }) {
    // ? Maybe add Bill & Amount
    const nameSize = (160 / Name.length)

    function DisplayCrown() {
        if (IsManager) {
            return (
                <Image source={crownImage} style={styles.icon} />
            )
        }
    }

    return (

        <View style={styles.rowContainer}>
            <View style={styles.crownAndNameContainer}>
                {DisplayCrown()}
                <Text adjustsFontSizeToFit style={[styles.cell, { fontSize: nameSize }]}>{Name}</Text>
            </View>
            <Text style={styles.cell}>|</Text>
            <Text style={styles.cell}>{Change}</Text>
            <Text style={styles.cell}>|</Text>

            <Image source={IsReady ? checkImage : awaitingImage} style={styles.icon} />
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
        fontSize: 25,
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