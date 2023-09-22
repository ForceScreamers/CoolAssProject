import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import PaymentInput from './PaymentInput'
import GroupList from '../components/GroupList'

export default function Payment({ GroupData }) {

    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                <Text>
                    aa
                </Text>
                <GroupList Members={GroupData} />
            </View>

            <View style={{ flex: 1 }}>
                <PaymentInput IsManager={true} />
            </View>
        </View>
    )
}