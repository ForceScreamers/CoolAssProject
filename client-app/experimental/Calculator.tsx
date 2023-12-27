import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

class User {
    id: number;
    price: number;
    amount: number;
    change: number;

    constructor(id: number, price: number, amount: number, change: number) {
        this.id = id;
        this.price = price;
        this.amount = amount;
        this.change = change;
    }
}

type UserRowProps = {
    Id: number,
    OnPriceChange: (id: number, price: number) => void,
    OnAmountChange: (id: number, amount: number) => void
}

const UserRow = ({ Id, OnPriceChange, OnAmountChange }: UserRowProps) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: 'center', marginRight: 20 }}>
                <Text>No. {Id + 1}</Text>
            </View>
            <View>
                <Text>Price</Text>
                <TextInput style={styles.textBox} onChangeText={(price: number) => OnPriceChange(Id, price)} keyboardType='numeric' />
            </View>
            <View>
                <Text>Amount</Text>
                <TextInput style={styles.textBox} onChangeText={(amount: number) => OnAmountChange(Id, amount)} keyboardType='numeric' />
            </View>
            <Text>Change</Text>
            <View style={{ justifyContent: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    <Text>0</Text>
                </View>
            </View>
        </View>
    )
}



const Calculator = ({ navigation }) => {
    const [userRows, setUserRows] = useState(new Array<User>(0));
    const [canPay, setCanPay] = useState(true);
    const MAX_USER_ROWS = 20;

    const [totalPrice, setTotalPrice] = useState(0);

    const [totalAmount, setTotalAmount] = useState(0);
    const [tipToPay, setTipToPay] = useState(0);

    useEffect(() => {
        setCanPay(totalAmount >= (totalPrice + (totalPrice * tipToPay / 100)) ? true : false);

    }, [totalPrice, totalAmount])

    function AddUserRow() {
        if (userRows.length < MAX_USER_ROWS) {
            setUserRows([...userRows, new User(userRows.length, 0, 0, 0)]);
        }
    };

    function RemoveUserRow() {
        if (userRows.length > 0) {
            userRows.pop();
            setUserRows([...userRows]);
        }
    };

    function Calculate() {
        //Clear previous calculations
        setTotalAmount(0);
        setTotalPrice(0);


        let updatedUserRows = userRows.map(user => {
            setTotalAmount(totalAmount => totalAmount + user.amount);
            setTotalPrice(totalPrice => totalPrice + user.price);
            //  c = amount - (price with tip)
            return { ...user, change: +user.amount - (+user.price + +(user.price * tipToPay / 100)) };
        });


        setUserRows(updatedUserRows);
        //  If the change is negative then the user owes money
        //  If the change is positive then the user can "cover" for a user who owes money
        //      - prompt the user "who do you want to cover for?"
        //          - recive a calculation of how much they owe you
        //  If the change is 0 nothing happends

        //  Plot a graph with who owes who money
    }


    function OnPriceChange(id: number, price: any) {
        let updatedUserRows = userRows.map(userRow => {
            if (userRow.id == id) {
                return { ...userRow, price: isNaN(price) ? 0 : parseFloat(price) };
            }
            return userRow;
        });

        setUserRows(updatedUserRows);
    }
    function OnAmountChange(id: number, amount: any) {
        let updatedUserRows = userRows.map(userRow => {
            if (userRow.id == id) {
                return { ...userRow, amount: isNaN(amount) ? 0 : parseFloat(amount) };
            }
            return userRow;
        });

        setUserRows(updatedUserRows);
    }
    function OnTipToPayChange(tip: any) {
        setTipToPay(parseFloat(tip));
    }

    const createUserRows = () => {
        return userRows.map((userRow, index) => {
            return (<UserRow OnPriceChange={OnPriceChange} OnAmountChange={OnAmountChange} key={index} Id={userRow.id} />)
        })
    }

    function PrintUserRows() {
        return userRows.map(userRow => {
            return <Text>{userRow.id}, price: {userRow.price}, amount: {userRow.amount}, change: {userRow.change}, tip: {tipToPay}</Text>
        })
    }

    function AlertUsers() {
        axios({
            url: 'http://10.0.2.2:3000/',
            method: 'get',
            data: { username: 'kfir' }
        }).catch(e => console.log(e)).then((res) => { console.log(res) })
    }

    return (
        <ScrollView style={styles.container}>

            {createUserRows()}

            <Text>calculate tip %</Text>
            <TextInput style={styles.textBox} onChangeText={(tip: number) => OnTipToPayChange(tip)} keyboardType='numeric' />

            <Button title="add" color="#00DD00" onPress={AddUserRow}>
                <Text>Press Here</Text>
            </Button>

            <Button title="remove" color="#DD0000" onPress={RemoveUserRow}>
                <Text>Press Here</Text>
            </Button>

            <Button title="calc" color="#0055DD" onPress={Calculate}>
                <Text>Press Here</Text>
            </Button>

            <Button title="TEST" onPress={AlertUsers} />




            <View>
                <Text>total price without tip: {totalPrice}</Text>
                <Text>total price with tip: {totalPrice + (totalPrice * tipToPay / 100)}</Text>
            </View>

            {/* FOR DEBUGGING */}
            <View>
                {PrintUserRows()}
                <Text>Can pay? {canPay.toString()}</Text>
            </View>


            <View>
                <Button title="navigate" onPress={() => navigation.navigate("home")} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    countContainer: {
        alignItems: 'center',
        padding: 10,
    },
    textBox: {
        backgroundColor: "lightblue",
        borderColor: "#000000",
        marginBottom: 10,
        width: 90,
        borderWidth: 1
    },
    gridContainer: {
        flexDirection: 'row'
    }
});

export default Calculator;