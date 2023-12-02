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
// Join group
// Remove from group
// Update group?
// Create group
// Add to group

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
    AddUserToGroup: async function (userId, groupId) {

        await db.collection("groups")
            .updateOne(
                { _id: new ObjectId(groupId) },
                { $addToSet: { user_ids: new ObjectId(userId) } })
            .catch((err) => {
                console.log(err)
            })
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
}

