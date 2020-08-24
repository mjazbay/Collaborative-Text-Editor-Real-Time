const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');

// const users = require('./routes/api/users');
const docs = require('./routes/api/docs');

const cors = require('cors');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Docs = require('./models/Docs');

app.use(cors());
//Body parser middleware 
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;
const url = process.env.MONGODB_URI || db;

//Connect to MongoDB
mongoose.connect(
    url,
    {
        useNewUrlParser: true,
    }
)
.then(() => console.log("MongoDB succesfully connected"))
.catch(err => console.log('MONGO DB CONNECTION ERROR --> ',err));

//passport middleware
// app.use(passport.initialize());

//passport config
// require('./config/passport')(passport);

//routes
// app.use("/api/users", users);
app.use("/api/docs", docs);
app.get('/', (req,res) => {
    res.sendFile('/Users/longhorn18/server-side' + '/index.html');
});

const port = process.env.PORT || 9000; 
// process.env.port is Heroku's port if you choose to deploy the app there

io.on('connection', (socket) => {
    console.log('DEBUG a socket connected');
    socket.on('update', contentData => {
        socket.broadcast.emit('update', contentData);
        // io.emit('update', contentData);
    })
    socket.on('disconnect', () => {
        console.log('DEBUG a socket disconnected');
    })
    socket.emit('fromAPI', {msg:'love from api'});
})


// app.listen(port, () => console.log(`Maksat, Server is running on port ${port} !`))
http.listen(port, () => console.log(`Maksat, Server is running on port ${port} !`))

Docs.find({}, (err, doc) => {
    console.log('debug server Docs  --> ', doc);
})


