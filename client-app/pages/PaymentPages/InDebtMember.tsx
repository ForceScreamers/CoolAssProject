import { View, Text, StyleSheet, Image, Button } from 'react-native'
import React, { useEffect } from 'react'


export default function InDebtMember({ Index, Name, AmountMissing, CanPayFor }) {
    const nameSize = (100 / Name.length)
    function HandleCanPayFor() {
        // TODO: emit update debt list
    }

    return (

        <View style={styles.rowContainer}>
            <View style={styles.crownAndNameContainer}>
                <Text adjustsFontSizeToFit style={[styles.cell, { fontSize: nameSize }]}>{Name}</Text>
            </View>
            {
                Index == 0
                    ?
                    <View style={styles.cell}>
                        <Text style={styles.cellHeaders}>כמה חסר</Text>
                        <Text style={styles.cellText}>{AmountMissing}</Text>
                    </View>
                    :
                    <View style={styles.cell}>
                        <Text style={styles.cellText}>{AmountMissing}</Text>
                    </View>
            }



            {/* If cant pay for, disable and change button title */}

            <Button title={CanPayFor ? 'השלם' : 'חסר עודף'} onPress={HandleCanPayFor} disabled={!CanPayFor} />

            {/* <Image source={IsReady ? checkImage : awaitingImage} style={styles.icon} /> */}
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