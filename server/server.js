const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors())

const PORT = 3000

let user_count = 0;
app.get('/', (req, res) => {
    res.send("HELLO");
});

io.on('connection', (socket) => {

    console.log('a user connected', user_count);
    user_count++;


    socket.on('calculate', (data) => {
        console.log(data);
    })


    socket.on('disconnect', (reason) => {
        user_count--;
        console.log('a user disconnected', user_count);
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

// //TODO: Connect to database
// //TODO: Calculate change & stuff on server



// io.on('connection', () => {
//     console.log('a user connected');
// })

// app.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`)
// })

// app.get('/', (req, res) => {
//     res.send('Hello World!')
//     console.log("res from /!")
// })

// app.get('/users', (req, res) => {

//     client.query('SELECT * FROM public."User";', (err, res) => {
//         console.log("E")
//         if (err) {
//             console.log(err.stack)
//         } else {
//             console.log(res.rows)

//             res.send(res.rows);
//         }
//     })
// })

// app.get('/user', (req, res) => {
//     res.send('This is user!');
// })

// app.post('/user', (req, res) => {
//     console.log(req);
// })
