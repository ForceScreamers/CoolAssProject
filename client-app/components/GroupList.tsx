import React, { useEffect } from 'react'
import { FlatList, View, Text } from 'react-native'
import GroupListMember from './GroupListMember'
import GroupListHeaders from './GroupListHeaders'
//  amount, change, bill, 
//  isReady, name, isManager


export default function GroupList({ Members }) {

    return (
        <View style={{ flex: 1 }}>
            <View>
                {/* List headers */}
                <GroupListHeaders />
            </View>

            <FlatList
                data={Members}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                    <GroupListMember
                        Index={index}
                        key={item.id}
                        Name={item.name}
                        Change={item.change}
                        Bill={item.bill}
                        Amount={item.amount}
                        IsReady={item.isReady}
                        IsManager={item.isManager}
                    />
                )}
            />
        </View>
    )
}
