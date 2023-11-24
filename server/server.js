const { Group, User } = require('./s_calculator')

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const storage = require('node-persist')

app.use(cors())

const PORT = 3000

app.get('/', (req, res) => {
    res.send("HELLO");
});

storage.init();

storage.setItem('users', [])


const NO_USER_FOUND = 0;

let groups = [
    new Group(1)
]

//! TODO: swap connectedUsers to the node persist option
//! TODO: fix node-persist funcitons not working
// TODO: disconnect all users when a server restarts
//TODO: Remember groups on server restart

groups[0].AddUser(new User('k1', 0, 0, 0, false))
groups[0].AddUser(new User('k2', 1, 0, 0, false))
groups[0].AddUser(new User('k3', 2, 0, 0, true))

groups[0].users[0].isReady = true;
groups[0].users[1].isReady = true;
groups[0].users[2].isReady = true;

function GetUserBySocketId(socketId) {
    for (let i = 0; i < connectedUsers.length; i++) {
        if (connectedUsers[i].id === socketId) {
            return connectedUsers[i];
        }
    }
    return NO_USER_FOUND;
}

/**
 * Used to update a property of an existing user.
 * Because parameters are passed by value, we need to find the original object within the list of users and update it's propery directly.
 */
function UpdateUserProp(user, prop, value) {
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


io.on('connection', async (socket) => {

    let users = await storage.getItem('users')
    users.push(new User('k', socket.id, 0, 0, false));
    storage.updateItem('users', users);

    console.log('user connected', connectedUsers.length);
    // console.log()

    socket.on('canCreateGroup', (data) => {
        console.log('creating group')
        let user = GetUserBySocketId(socket.id);
        let groupId;
        if (user.isInAnyGroup == false) {
            groupId = CreateGroupFor(user);

            let emitData = {
                groupCode: groupId
            }

            socket.emit('createdGroup', emitData);
        }
        else {
            socket.emit('cantCreateGroup');
        }
    })

    socket.on('canJoinGroup', data => {
        let user = GetUserBySocketId(socket.id);
        let group = GetGroupById(data.groupId);

        if (user.isInAnyGroup === false && group !== undefined) {
            console.log('joined group')
            UpdateUserProp(user, 'isInAnyGroup', true);
            UpdateUserProp(user, 'groupId', group.id);

            group.AddUser(user);

            let emitData = JSON.stringify(
                groups[0].users
            )
            socket.emit('joinedGroup', emitData)
        }
        else {
            socket.emit('groupNotFound');
            console.log("not found");
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

    socket.on('leaveGroup', data => {
        UpdateUserProp(user, 'isInAnyGroup', false);
    })


    socket.on('disconnect', (reason) => {
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


server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});





// //Check if works without this
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

