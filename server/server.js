const { Group, User } = require('./s_calculator')

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors())

const PORT = 3000

app.get('/', (req, res) => {
    res.send("HELLO");
});

let groups = [];//? Maybe refactore to a better data structure
let connectedUsers = [];

const NO_USER_FOUND = 0;


// //TODO: Connect to database
// //TODO: Calculate change & stuff on server

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
}

function GenerateGroupId() {
    return groups.length;// The group id is dictated by it's index in the groups array
}

io.on('connection', (socket) => {

    connectedUsers.push(new User(socket.id, 0, 0, false));
    console.log('a user connected', connectedUsers.length);


    socket.on('createGroup', (data) => {
        let user = GetUserBySocketId(socket.id);
        if (user.isInAnyGroup == false) {
            CreateGroupFor(user);
        }
    })

    socket.on('joinGroup', data => {
        let user = GetUserBySocketId(socket.id);
        if (user.isInAnyGroup == false) {
            console.log('added')
            GetGroupById(data.groupId).AddUser(user);
            UpdateUserProp(user, 'isInAnyGroup', true);
        }
        console.log(connectedUsers);
        console.log(groups);

        //  create room and emit an update to the room
        let emitData = JSON.stringify({
            groupData: [{
                name: 'Kfir!',
                change: user.change,
                isManager: user.isManager,
                isReady: true,
            }]
        })
        socket.emit('updateGroup', emitData)
    })

    socket.on('calculate', data => {
        console.log("----------- calc -----------");
    })

    socket.on('leaveGroup', data => {
        UpdateUserProp(user, 'isInAnyGroup', false);
        //
    })


    socket.on('disconnect', (reason) => {
        for (let i = 0; i < connectedUsers.length; i++) {
            if (connectedUsers[i].id == socket.id) {
                connectedUsers.splice(i, 1);
            }
        }
        console.log('a user disconnected', connectedUsers.length);
    })
});



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

