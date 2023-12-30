import React, { useEffect } from 'react'
import { FlatList, View, Text } from 'react-native'
import InDebtMember from './InDebtMember'


export default function InDebtListDisplay({ UsersInDebt }) {

    return (
        <View style={{ flex: 1 }}>

            <FlatList
                data={UsersInDebt}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                    <InDebtMember
                        Index={index}
                        key={item.id}
                        Name={item.username}
                        AmountMissing={item.missingAmount}
                        CanPayFor={true}
                    />
                )}
            />
        </View>
    )
}
