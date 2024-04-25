const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Helper = require('./database-utils/helper');
const { DEBT_STATE } = require('./server-data/consts');
const { USERNAME_MAX_LENGTH } = require('./server-data/consts');

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

function isUsernameValid(username) {
    if (username === '') {
        return false;
    }
    if (username.length > USERNAME_MAX_LENGTH) {
        return false;
    }
    return true;
}

io.on('connection', (socket) => {

    // Send the client it's user id
    console.log("user connected")

    // Try to get user id
    // If there is no user id, create new user and ask for username
    socket.on('createNewUser', async (data, proceedToHome) => {
        console.log("creating new user...")
        console.log("username", data.username)

        if (isUsernameValid(data.username)) {
            let userId = await Helper.AddNewUser(data.username)

            socket.emit('updateId', { userId: userId })
            proceedToHome()
        }
        else {
            console.log("Invalid")
            // TODO: Send invalid username message
        }
    })


    socket.on('updateUsername', async data => {
        console.log(data.userId, data.username)
        Helper.UpdateUsername(data.userId, data.username)
    })



    socket.on('canCreateGroup', async (data) => {
        console.log('creating group')

        let groupId = await Helper.CreateGroupForUser(data.userId)

        if (groupId) {
            socket.emit('createdGroup', { groupCode: groupId });
        }
        else {
            socket.emit('cantCreateGroup');
        }
    })

    socket.on('requestJoinGroup', async data => {
        console.log("server 75: req join");

        let userId = data.userId;
        let groupCode = data.groupCode;

        let alreadyInGroup = await Helper.IsUserInAnyGroup(userId);
        let doesGroupExist = await Helper.DoesGroupExistByCode(groupCode);


        if (!alreadyInGroup && doesGroupExist) {

            Helper.AddUserToGroupByCode(userId, groupCode).then(async () => {

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

    async function UpdateUserPaymentData(userId, paymentData) {
        await Helper.UpdateUserIsReady(userId, true)
        await Helper.UpdateUserPaymentDetails(userId, ParsePaymentDetails(paymentData))
        await Helper.UpdateChangeForParentGroup(userId);
    }

    socket.on('userReady', async data => {
        let userId = data.userId;

        await UpdateUserPaymentData(userId, data.payment);

        socket.emit('updateGroup', await Helper.GetGroupByUser(userId))

        if (await Helper.IsGroupReadyByUser(userId)) {

            let userPaymentData = await Helper.GetUserPaymentData(userId)

            // Send to user its state according to their change status
            let change = userPaymentData.change;

            if (change < 0) {// Owes money
                CalculateAndEmitMissingAmount(userPaymentData)

            } else if (change > 0) {// Has change to spare
                CalculateAndEmitDebtorsForUser(userPaymentData, userId)

            } else if (change === 0) {// No change
                socket.emit('paymentNoChange')
                Helper.SetDoneWithPayment(data.userId, true)

            }
        }
    })

    socket.on('doneWithPayment', async (data) => {
        await Helper.SetDoneWithPayment(data.userId, true);
    })

    socket.on('doneWithLeftover', async (data) => {
        await Helper.SetDoneWithLeftover(data.userId, true);

        if (await Helper.IsGroupDoneWithLeftover(await Helper.GetParentGroupId(data.userId))) {

            //  Update debts for every user
            leftover.forEach(async leftoverData => {
                // Create or update debt between the user and the other one
                await Helper.AddDebt(leftoverData.userId, leftoverData.debtorId, leftoverData.amount);

                // Subtract to show how much the creditor has left for other or for his own left over change
                await Helper.SubtractCreditorAmount(leftoverData.userId, leftoverData.amount);

                //  User in DEBT is done (other user)
                await Helper.SetDoneWithPayment(leftoverData.debtorId, true);
            })


            // let debtState = await Helper.EvalUserDebtState(data.userId);
            console.log("Group is Done with payment")
            // If user is in debt
            // if -- is a creditor
            // If user is even
            // let creditors = await Helper.GetCreditorsForUser(data.userId)

            // socket.emit('paymentPayedFor', { creditor: creditors })
            // If user is 
            let debtors = await Helper.GetDebtorsForUser(data.userId);
            socket.emit('someoneOwesYou', debtors)


            // if (debtState === DEBT_STATE.DEBTOR) {

            // } else if (debtState === DEBT_STATE.CREDITOR) {




            // let dbData = await Helper.GetDebtorsForUser(data.userId);

            // let debtors=[]
            // dbData.debtors.forEach(debtor=>{
            //     debtors.push({
            //         amount: debtor.debt_amount,
            //         username: 
            //     })
            // })


            // }

        }
    })




    let leftover = [];
    socket.on('payFor', async (data, enableCancelOption) => {
        console.log('paying for')

        leftover.push({
            creditor: data.userId,
            debtor: data.debtorId,
            amount: data.amount
        })

        console.log(leftover);



        // Update group

        await Helper.SetDoneWithLeftover(data.debtorId, true);
        let group = await Helper.GetGroupByUser(data.userId);
        // console.log(group)
        socket.emit('updateGroup', group);

        // enableCancelOption();
    })

    socket.on('cancelPayFor', async (data, disableCancelOption) => {

        let payToCancel = leftover.find(pay => {
            return pay.creditor === data.userId && pay.debtor === data.debtorId
        })

        leftover.splice(leftover.indexOf(payToCancel))

        await Helper.SetDoneWithLeftover(data.debtorId, true);
        let group = await Helper.GetGroupByUser(data.userId);
        // console.log(group)
        socket.emit('updateGroup', group);

        disableCancelOption();
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

    socket.on('leaveGroup', async userId => {
        let groupId = await Helper.RemoveUserFromParentGroup(userId)

        if (await Helper.GroupIsEmpty(groupId)) {
            await Helper.DeleteGroup(groupId);
        }
    })

    socket.on('userReconnect', async (userId, navigateToPayment) => {
        console.log("Reconnecting...");
        if (await Helper.IsUserInAnyGroup(userId) === true) {

            let group = await Helper.GetGroupByUser(userId);

            socket.emit('updateGroup', group)
            Helper.UpdateChangeForParentGroup(userId)
            navigateToPayment()

            if (await Helper.IsGroupDoneWithLeftover(await Helper.GetParentGroupId(userId))) {
                // let debtors = await Helper.GetDebtorsForUser(userId);
                // socket.emit('someoneOwesYou', debtors)
            }
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

