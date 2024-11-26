
const express = require('express');
const cors = require('cors');


const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`listening on *:${port}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*", // Replace with your client URL
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: false
    }
});

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

io.on('connection', function (socket) {

    console.log('A user connected.');

    socket.on('disconnect', function () {
        console.log('A user disconnected.');
    });

    socket.on('join', function (room) {
        console.log(`Joining room ${room}.`);
        socket.join(room);
    });
});

app.get('/', (req, res) => {
    res.status(200).send({ "status": "online" });
});

app.post('/event/', (req, res) => {

    const { room, type, data, message } = req.body;

    console.log(data);

    if (room) {
        io.to(room).emit("event", { type, data, message })
    } else {
        io.emit("event", { type, data, message })
    }

    res.status(200).send({})
});


