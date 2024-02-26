const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const cors = require('cors')
app.use(cors());

const http = require('http')
const socketIo = require('socket.io')
const server = http.Server(app)
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb+srv://navneetsharma9340:%40NS131201@navneet.pl1q556.mongodb.net/userData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// User schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  loginId: String,
  password: String,
  creationTime: { type: Date, default: Date.now },
  lastUpdatedOn: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


app.get('/users', (req, res) => {
  res.sendFile(__dirname + '/data.html')
})
app.use('/', express.static(__dirname + "/public"))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html')
})

const userDetails = {}

app.post('/', (req, res) => {

  const userData = req.body;
  // console.log(userData)
  User.create(userData).then(() => {
    io.on('connection', socket => {
      console.log('A user connected:', socket.id);

      socket.join('live users');

      userDetails[socket.id] = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        socketId: socket.id,
      };
      console.log(userDetails)
      // Emit event to update list of connected users
      io.to('live users').emit('UserList', Object.values(userDetails));

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

      });
    });
    console.log("Successfully Inserted!");
    res.send("User registered")
  }).catch((err) => {
    console.error('Error inserting user:', err);
    res.status(500).send('Internal server error.');
  })
})

app.post('/users', (req, res) => {
  const email = req.body.email;

  User.find({ email })
    .then((data) => {
      res.json(data)
      //console.log(user)
    }).catch((err) => {
      console.error('Error to find data:', err);
      res.status(500).send('error to find data.');
    })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

