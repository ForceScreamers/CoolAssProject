const { Group, User } = require('./server-data/s_calculator')

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


app.get('/users', (req, res) => {
    // Helper.GetUsers().then(data => console.log(data))
    Helper.CreateGroupForUser("6569c41c4b44a4eb21963617").then(data => console.log(data))
})


const NO_USER_FOUND = 0;


function GetUserBySocketId(socketId) {
    for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i].id === socketId) {
            return connectedUsers[i];
        }
    }
    return NO_USER_FOUND;
}

let connectedUsers = []

function UpdateUserProp(user, prop, value) {
    /**
     * Used to update a property of an existing user.
     * Because parameters are passed by value, we need to find the original object within the list of users and update it's propery directly.
     */
    let connectedUserIndex = connectedUsers.map(connectedUser => connectedUser.id).indexOf(user.id)

    if (connectedUserIndex !== -1) {
        connectedUsers[connectedUserIndex][prop] = value;
    }
}

function GetGroupById(id) {
    let foundGroup = groups.filter(group => {
        return group.id === id;
    })

    return foundGroup[0];
}

function CreateGroupFor(user) {
    UpdateUserProp(user, 'isInAnyGroup', true);
    UpdateUserProp(user, 'isManager', true);

    let groupId = GenerateGroupId();
    groups.push(new Group(groupId));

    GetGroupById(groupId).AddUser(user);

    return groupId;
}

function GenerateGroupId() {
    return groups.length;// The group id is dictated by it's index in the groups array
}


io.on('connection', (socket) => {

    // Send the client it's user id
    console.log("user connected")
    // socket.emit('userInitialize', {userId: })
    // Init new user
    // let { userExists, userId } = await Helper.AddUser('default_username :3');

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
        // let user = GetUserBySocketId(socket.id);


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



    socket.on('userReady', data => {
        let userData = data;

        let user = GetUserBySocketId(socket.id);

        //  Update user data
        UpdateUserProp(user, 'amount', parseFloat(userData.amount))//TODO:create try parse float that returns 0 if isn't float
        UpdateUserProp(user, 'bill', parseFloat(userData.bill))
        UpdateUserProp(user, 'isReady', true);

        let group = GetGroupById(user.groupId);


        socket.emit('updatedGroup', group.users)

        if (group.IsReady()) {
            //TODO:  Calculate all
            group.CalculateChangeForAll()
            console.log('group ready!')
        }
    })

    socket.on('userNotReady', () => {
        let user = GetUserBySocketId(socket.id);
        console.log("Not ")

        UpdateUserProp(user, 'isReady', false);

        let group = GetGroupById(user.groupId);
        socket.emit('updatedGroup', group.users)
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
        console.log(reason)
        RemoveConnectedUserById(socket.id)
        console.log('a user disconnected', connectedUsers.length);
    })
});

function RemoveConnectedUserById(id) {
    for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i].id == id) {
            connectedUsers.splice(i, 1);
        }
    }
}







// //Check if works without this
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

