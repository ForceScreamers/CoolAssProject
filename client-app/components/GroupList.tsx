import React from 'react'
import { FlatList, View, Text } from 'react-native'
import GroupListMember from './GroupListMember'

//  amount, change, bill, 
//  isReady, name, isManager


export default function GroupList({ Members }) {


    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={Members}
                renderItem={({ item }) => (
                    <GroupListMember
                        Name={item.name}
                        Amount={item.amount}
                        Change={item.change}
                        Bill={item.bill}
                        IsReady={item.isReady}
                        IsManager={item.isManager}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </View>
    )
}
