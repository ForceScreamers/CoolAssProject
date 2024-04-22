import React, { useEffect } from 'react'
import { FlatList, View, Text } from 'react-native'
import GroupListMember from './GroupListMember'
import GroupListHeaders from './GroupListHeaders'
//  amount, change, bill, 
//  isReady, name, isManager


export default function DisplayGroupList({ GroupList }) {

    return (
        <View style={{ flex: 1 }}>
            <View>
                {/* List headers */}
                <GroupListHeaders />
            </View>

            <FlatList
                data={GroupList}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                    <GroupListMember
                        Index={index}
                        key={item.id}
                        Name={item.username}
                        Change={item.change}
                        Bill={item.bill}
                        Amount={item.amount}
                        IsReady={item.is_ready}
                        IsManager={item.is_manager}
                    />
                )}
            />
        </View>
    )
}
