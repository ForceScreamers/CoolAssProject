const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

let db;

// db connection
connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
})

// TODO: Db queries:
// Create user
// Get group


// Update group?
// Create group
// Add to group

// TODO: Create an error handler for queries instead of catch(()=>{})

module.exports = {
    GetUsers: async function () {
        let users = []
        await db.collection("users")
            .find()
            .forEach(book => { users.push(book) })
            .catch((err) => {
                console.log(err)
            })
        return users;
    },
    RegisterUser: async function (username) {

    },
    UserIsExists: async function (userId) {
        // Check if exists
        let userCount = await db.collection("users")
            .count({
                _id: new ObjectId(userId)
            })
            .catch(err => console.log(err))
        return userCount == 0
    },
    AddUser: async function () {
        //  Add user
        let userId;

        await db.collection("users")
            .insertOne({
                username: '',
                amount: 0,
                bill: 0,
                change: 0,
                is_manager: false,
                is_ready: false
            })
            .then(result => {
                userId = result.insertedId;
            })
            .catch(err => console.log(err))

        return userId;

    },

    // TODO: add group not found
    AddUserToGroupById: async function (userId, groupId) {

        await db.collection("groups")
            .updateOne(
                { _id: new ObjectId(groupId) },
                { $addToSet: { user_ids: new ObjectId(userId) } })
            .catch((err) => {
                console.log(err)
            })
    },
    AddUserToGroupByCode: async function (userId, groupCode) {

        // Get group id by group code
        let groupId = await db.collection("groups")
            .find({ code: groupCode }, { _id: 1 })
            .catch(err => console.log(err))

        this.AddUserToGroupById(userId, groupId);
    },
    RemoveUserFromGroup: async function (userId, groupId) {

        await db.collection("groups")
            .updateOne(
                { _id: new ObjectId(groupId) },
                { $pull: { user_ids: new ObjectId(userId) } })
            .catch((err) => {
                console.log(err)
            })
    },
    IsUserInAnyGroup: async function (userId) {
        // TODO: Consider searching with an index
        let userCount = await db.collection("groups")
            .count({
                user_ids: { $in: [new ObjectId(userId)] }
            })
            .catch(err => console.log(err))

        if (userCount == 0) {
            return true;
        } else {
            return false;
        }
    },
    CreateGroupForUser: async function (userId) {
        // Assuming the user is in no group
        let groupId;

        if (this.IsUserInAnyGroup(userId) == 0) {
            // Add new group
            await db.collection("groups")
                .insertOne({
                    user_ids: [new ObjectId(userId)],
                    tip_percent: 0
                })
                .then(result => {
                    groupId = result.insertedId;
                })
                .catch((err) => {
                    console.log(err)
                })

            // Change user to manager
            await db.collection("users")
                .updateOne({
                    _id: new ObjectId(userId)
                }, { $set: { is_manager: true } })
                .catch(err => console.log(err))
        }

        return groupId;
    },
    GetGroupByUser: async function (userId) {
        let group = await db.collection("groups")
            .find({})
    },
    UpdateUsername: async function (userId, newUsername) {
        await db.collection("users")
            .updateOne({ _id: new ObjectId(userId) }, { $set: { username: newUsername } })
    }


}

