const { connectToDb, getDb } = require('./db')

let db;

// db connection
connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
})

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
    }
}
