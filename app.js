const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const appRouter = require('./router/app-router')(router, passport);
const flash = require('express-flash');
const session = require('express-session');

//connect to db
mongoose.connect('mongodb://mongo:27017/nodeapp', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

//check connection
db.once('open', () => {
    console.log('Mongodb connected!!')
});

//on getting db error
db.on('error', (err) => {
    console.log(`error ${err}`)
});

//Initialised passport
require('./passport-config')(passport);

//Intialized express framework
const app = express();

//Logging middleware
let logMiddleware = (req, res, next) => {
    console.log('******************')
    console.log(req.headers)
    console.log(res.body)
    next()
}

//use logging middelware
app.use(logMiddleware)
//set view engine
app.set('view engine', 'ejs');
// Use application-level middleware
app.use(express.urlencoded({extended: false}));
//Use flash-messages
app.use(flash());
//session handling.
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
//set router
app.use('/', appRouter);
// app.get('/', (req, res) => {
//     res.render('home');
// })
// app.get('/testing',(req, res)=>{
//     User.find({}, function(err, users) {
//         if(err){
//             console.log(err);
//         }else{
//             res.json(users);
//         }
//     });
// })

//create & listen http server on 8080
app.listen('8082', () =>{
    console.log('listen port 8082');
});