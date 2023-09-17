import React, { useEffect } from 'react'
import { FlatList, View, Text } from 'react-native'
import GroupListMember from './GroupListMember'

//  amount, change, bill, 
//  isReady, name, isManager


export default function GroupList({ Members }) {

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={Members}
                keyExtractor={(item, index) => { return index.toString() }}
                renderItem={({ item }) => (
                    <GroupListMember
                        Name={item.name}
                        Change={item.change}
                        IsReady={item.isReady}
                        IsManager={item.isManager}
                    />
                )}
            />
        </View>
    )
}
