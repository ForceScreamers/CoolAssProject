const express = require('express')
const { Client } = require('pg')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//TODO: Connect to database
//TODO: Calculate change & stuff on server


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log("res from /!")
})

app.get('/users', (req, res) => {

    client.query('SELECT * FROM public."User";', (err, res) => {
        console.log("E")
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows)

            res.send(res.rows);
        }
    })
})

app.get('/user', (req, res) => {
    res.send('This is user!');
})

app.post('/user', (req, res) => {
    console.log(req);
})
