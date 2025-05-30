import React, { useEffect } from 'react'
import { FlatList, View, Text } from 'react-native'
import InDebtMember from './InDebtMember'


export default function InDebtListDisplay({ InDebtList }) {

    return (
        <View style={{ flex: 1 }}>

            <FlatList
                data={InDebtList}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                    <InDebtMember
                        Index={index}
                        key={item.id}
                        Name={item.username}
                        MissingAmount={item.missingAmount}
                        CanPayFor={item.canPayFor}
                        Id={item.id}
                        DoneWithLeftover={item.doneWithLeftover}

                    />
                )}
            />
        </View>
    )
}
