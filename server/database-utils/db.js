const { MongoClient } = require('mongodb')

let dbConnection;

module.exports = {
    connectToDb: (cb) => {
        // Creating connection to the database
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

