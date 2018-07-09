const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/user');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/exercise/new-user', (req, res) => {
    const { username } = req.body;
    if (!username) {
        res.end('Path `username` is required.');
    }
    const user = new User({ username });
    user.save((err, product) => {
        if (err) {
            if (err.code === 11000) {
                res.end('username already taken');
            }
        }
        res.json(user);
    });
});

// {
// "description": "sss",
// "duration": 11,
// "date": "Thu Jan 01 1970"
// }

app.post('/api/exercise/add', (req, res) => {
    let { userId, description, duration, date } = req.body;
    let data = {};
    if(!userId) {
        res.end('unknown _id');
    }
    User.findById(userId, function (err, user) {
        if(err) {
            res.end('Error!');
        }
        if(!user) {
            res.end('unknown _id');
        }
        data.id = user._id;
        data.username = user.username;
        if(!duration) {
            res.end('Path `duration` is required.');
        }
        if(!Number(duration)) {
            res.end(`Cast to Number failed for value ${duration} at path "duration"`);
        }
        data.duration = Number(duration);
        if(!description) {
            res.end('Path `description` is required.');
        }
        data.description = description;
        if(!date || new Date(date) == 'Invalid Date') {
            res.end('Invalid Date');
        }
        date = new Date(date);
        data.date = date.toDateString();
        res.json(data);
    });
});

// Not found middleware
app.use((req, res, next) => {
    return next({ status: 404, message: 'not found' });
});

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage;

    if (err.errors) {
        // mongoose validation error
        errCode = 400; // bad request
        const keys = Object.keys(err.errors);
        // report the first validation error
        errMessage = err.errors[keys[0]].message;
    } else {
        // generic or custom error
        errCode = err.status || 500;
        errMessage = err.message || 'Internal Server Error';
    }
    res.status(errCode)
        .type('txt')
        .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
