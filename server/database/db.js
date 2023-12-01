const { MongoClient } = require('mongodb')

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/cool-ass-project').then((client) => {
            dbConnection = client.db()
            return cb()
        })
            .catch(err => {
                console.log(err);
                return cb(err)
            })
    },
    getDb: () => {
        return dbConnection;
    }
}

// TODO: Db queries:
// Create user
// Get group
// Join group
// Remove from group
// Update group?
// Create group
// Add to group