const Startegy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// Configure the local strategy for use by Passport.
module.exports = (passport) => {
    // The local strategy require a `verify` function which receives the credentials
    // (`username` and `password`) submitted by the user.  The function must verify
    // that the password is correct and then invoke `done` with a user object, which
    // will be set at `req.user` in route handlers after authentication.
    passport.use(new Startegy((username, password, done) => {
        try{
            User.find({'userName': username}, (err, user) => {
                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$');
                if(err || _.isEmpty(user)){
                    return done(null, false, {message: 'No user with that username!'});
                }else{
                    if(user[0].password){
                        bcrypt.compare(password, user[0].password, (err, result) => {
                            if(err || !result){
                                return done(null, false, {message: 'Incorrect password!'});
                            }
                            return done(null, user, {message: 'Sucessfully loggedIn!'});
                        });
                    }
                }
            });
        }catch(err){
            return done(err);
        }
    }));

    // Configure Passport authenticated session persistence.
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  The
    // typical implementation of this is as simple as supplying the user ID when
    // serializing, and querying the user record by ID from the database when
    // deserializing.
    passport.serializeUser((user, done) => {
        console.log('******************************');
        console.log(user[0]);
        console.log('******************************');
        done(null, user[0]._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById({'_id': id}, (err, user) => {
            if(err) { return done(err); }
            done(null, user);
        });
    });
}