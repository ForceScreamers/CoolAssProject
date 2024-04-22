const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Helper = require('./database-utils/helper');
const { DEBTOR, CREDITOR } = require('./server-data/consts');


const app = express();
const server = createServer(app);
const io = new Server(server);


app.use(cors())

const PORT = 3000

server.listen(PORT)


app.get('/', (req, res) => {
    res.send("HELLO");
});


// app.get('/users', (req, res) => {
// Helper.GetUsers().then(data => console.log(data))
// Helper.CreateGroupForUser("6569c41c4b44a4eb21963617").then(data => console.log(data))
// })



io.on('connection', (socket) => {

    // Send the client it's user id
    console.log("user connected")

    // Try to get user id
    // If there is no user id, create new user and ask for username
    socket.on('createNewUser', async (data, proceedToHome) => {
        console.log("creating new user...")
        console.log("username", data.username)

        // TODO: Validate username and send message accordingly
        if (data.username !== '') {
            let userId = await Helper.AddNewUser(data.username)

            socket.emit('updateId', { userId: userId })
            proceedToHome()
        }
    })


    socket.on('updateUsername', async data => {
        console.log(data.userId, data.username)
        Helper.UpdateUsername(data.userId, data.username)
    })



    socket.on('canCreateGroup', (data) => {
        console.log('creating group')

        let groupId = Helper.CreateGroupForUser(data.userId)

        if (groupId) {
            socket.emit('createdGroup', { groupCode: groupId });
        }
        else {
            socket.emit('cantCreateGroup');
        }
    })

    socket.on('requestJoinGroup', async data => {
        console.log("server 75: req join");
        if (await Helper.IsUserInAnyGroup(data.userId) === false) {
            console.log("Add user:", data);
            Helper.AddUserToGroupByCode(data.userId, data.groupCode).then(async (test) => {

                try {
                    let group = await Helper.GetGroupByUser(data.userId);
                    socket.emit('updateGroup', group)

                    socket.emit('joinedGroup')
                }
                catch (err) {
                    console.error(err);
                }


            })

        }
        else {
            console.log("not found")
            socket.emit('groupNotFound');
        }
    })

    function ParsePaymentDetails(data) {
        //TODO:create try parse float that returns 0 if isn't float
        let parsedData = {
            amount: parseFloat(data.amount),
            bill: parseFloat(data.bill),
            change: parseFloat(data.change),
        }
        return parsedData;
    }



    function CalculateAndEmitMissingAmount(userPaymentData) {
        let amountMissing = Math.abs(userPaymentData.change);
        socket.emit('paymentMissingAmount', amountMissing)
    }

    async function CalculateAndEmitDebtorsForUser(userPaymentData, userId) {
        let usersInDebt = ExtractUsersInDebt(await Helper.GetGroupByUser(userId));

        if (usersInDebt.length === 0) {// No one has negative change, just send change

            socket.emit('leftoverChange', userPaymentData.change)
            Helper.SetDoneWithPayment(userId, true)
        } else {//Each client will calculate if can pay for the users that the server sends

            socket.emit('paymentLeftoverChangePayForSomeone')
            Helper.SetDoneWithPayment(userId, true)
        }
    }


    function ExtractUsersInDebt(group) {
        //Get all users with negative change
        let usersInDebt = []
        group.forEach(user => {
            if (user.change < 0) {
                usersInDebt.push(user)
            }
        })
        return usersInDebt;
    }

    socket.on('userReady', async data => {
        // TODO: function is too big!

        // ! Debug
        let dbData = await Helper.GetDebtorsForUser(data.userId);

        let userId = data.userId;

        await Helper.UpdateUserIsReady(userId, true)
        await Helper.UpdateUserPaymentDetails(userId, ParsePaymentDetails(data.payment))// Parse and update the amount and bill in db
        await Helper.UpdateChangeForParentGroup(userId);

        socket.emit('updateGroup', await Helper.GetGroupByUser(userId))

        if (await Helper.IsGroupReadyByUser(userId)) {

            let userPaymentData = await Helper.GetUserPaymentData(userId)
            // Send to user its state according to their change status
            let change = userPaymentData.change;

            if (change < 0) {
                // Owes money
                CalculateAndEmitMissingAmount(userPaymentData)

            } else if (change > 0) {
                // Has change to spare
                await CalculateAndEmitDebtorsForUser(userPaymentData, userId)

            } else if (change === 0) {
                // No change

                socket.emit('paymentNoChange')
                Helper.SetDoneWithPayment(data.userId, true)
            }
        }
    })

    socket.on('payFor', async (data) => {
        console.log('paying for')

        Helper.AddDebt(data.userId, data.debtorId, data.amount);
        Helper.SubtractCreditorAmount(data.userId, data.amount);// Subtract to show how much the creditor has left for other or for his own left over change
        Helper.SetDoneWithPayment(data.debtorId, true);

        let group = await Helper.GetGroupByUser(data.userId);
        socket.emit('updateGroup', group)

        if (await Helper.IsGroupDoneWithPayment(await Helper.GetParentGroupId(data.userId))) {
            let debtState = await Helper.GetUserDebtState(data.userId);

            if (debtState === DEBTOR) {
                let creditors = await Helper.GetCreditorsForUser(data.userId)
                console.log("🚀 ~ file: server.js:181 ~ creditor:", creditors)
                socket.emit('paymentPayedFor', { creditor: creditors })
            } else if (debtState === CREDITOR) {
                // let dbData = await Helper.GetDebtorsForUser(data.userId);
                // console.log("🚀 ~ file: server.js:186 ~ debtors:", dbData)

                // let debtors=[]
                // dbData.debtors.forEach(debtor=>{
                //     debtors.push({
                //         amount: debtor.debt_amount,
                //         username: 
                //     })
                // })


                // socket.emit('someoneOwesYou', dbData.debtors)
            }

        }
    })


    socket.on('userNotReady', async (userId) => {
        await Helper.UpdateUserIsReady(userId, false)
        console.log("Not ready")
        let group = await Helper.GetGroupByUser(userId);
        socket.emit('updateGroup', group)
    })

    socket.on('isInAnyGroup', async (userId, proceedToReconnection) => {
        isInAnyGroup = await Helper.IsUserInAnyGroup(userId)

        if (isInAnyGroup) {
            proceedToReconnection()
        }
    })

    socket.on('leaveGroup', userId => {
        Helper.RemoveUserFromParentGroup(userId)
    })

    socket.on('userReconnect', async (userId, proceedToPayment) => {
        console.log("Reconnecting...");
        if (await Helper.IsUserInAnyGroup(userId) === true) {

            let group = await Helper.GetGroupByUser(userId);

            socket.emit('updateGroup', group)
            Helper.UpdateChangeForParentGroup(userId)
            proceedToPayment()
        }
    })


    socket.once('disconnect', (reason) => {
        // TODO: finish
        console.log(reason)
        // RemoveConnectedUserById(socket.id)
    })
});









// //Check if works without this
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

