const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Helper = require('./database-utils/helper');


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
        if (await Helper.IsUserInAnyGroup(data.userId) === false) {
            await Helper.AddUserToGroupByCode(data.userId, data.groupCode)

            let group = await Helper.GetGroupByUser(data.userId);

            socket.emit('updateGroup', group)

            socket.emit('joinedGroup')

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
        let amountMissing = userPaymentData.change * -1;
        socket.emit('paymentMissingAmount', amountMissing)
    }

    function CalculateAndEmitDebts(userPaymentData) {
        let noOneOwesMoney = true;
        if (noOneOwesMoney) {
            // no one has negative change

            socket.emit('leftoverChange', userPaymentData.change)
        } else {
            // Somone owes money
            // you can pay for someone
            // TODO: add who can you pay for

            //Get all users with negative change
            // return those who's abs change is smaller than yours
            // if there are users left that cant be covered, emit appropriate message
            socket.emit('paymentLeftoverChangePayForSomeone', data)
        }
    }

    function EmitStateByChange(userPaymentData) {
        // Send to user its state according to their change status
        let change = userPaymentData.change;

        if (change < 0) {
            // Owes money
            CalculateAndEmitMissingAmount(userPaymentData)

        } else if (change > 0) {
            // Has change to spare
            CalculateAndEmitDebts(userPaymentData);

        } else if (change === 0) {
            // No change
            socket.emit('paymentNoChange')
        }
    }

    socket.on('userReady', async data => {
        console.log(data)
        Helper.UpdateUserIsReady(data.userId, true)

        // Parse and update the amount and bill in db
        Helper.UpdateUserPaymentDetails(data.userId, ParsePaymentDetails(data.payment))

        await Helper.UpdateChangeForParentGroup(data.userId);

        socket.emit('updateGroup', await Helper.GetGroupByUser(data.userId))

        if (await Helper.IsGroupReadyByUser(data.userId)) {
            EmitStateByChange(await Helper.GetUserPaymentData(data.userId))
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
        console.log('leaving group')
        Helper.RemoveUserFromParentGroup(userId)
    })

    socket.on('userReconnect', async (userId, proceedToPayment) => {
        if (await Helper.IsUserInAnyGroup(userId) === true) {

            let group = await Helper.GetGroupByUser(userId);

            socket.emit('updateGroup', group)
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

