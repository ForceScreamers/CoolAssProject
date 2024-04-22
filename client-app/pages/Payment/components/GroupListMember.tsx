import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'

const checkImage = require('../../../assets/check.png')
const awaitingImage = require('../../../assets/awaiting.png')
const crownImage = require('../../../assets/crown.png')


export default function GroupListMember({ Index, Bill, Amount, Change, IsReady, Name, IsManager }) {
    // ? Maybe add Bill & Amount
    const nameSize = (100 / Name.length)

    function DisplayCrown() {
        console.log("Is", IsManager)
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

            {
                Index == 0
                    ?
                    <View style={styles.cell}>
                        <Text style={styles.cellHeaders}>חשבון</Text>
                        <Text style={styles.cellText}>{Change}</Text>
                    </View>
                    :
                    <View style={styles.cell}>
                        <Text style={styles.cellText}>{Change}</Text>
                    </View>
            }

            <Text style={styles.cell}>|</Text>
            <Text style={styles.cell}>{Bill}</Text>
            <Text style={styles.cell}>|</Text>
            <Text style={styles.cell}>{Amount}</Text>
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
        fontSize: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellHeaders: {
        color: 'black',
        paddingBottom: 0
    },
    cellText: {
        color: 'black',
        fontSize: 20
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