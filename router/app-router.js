const User = require('./../models/user');
const Profile = require('./../models/profile');
const bcrypt = require('bcrypt');

//middleware function to check user is loggedin or not
function ensureLoggedIn(req, res, next){
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports = (router, passport) => {
    router.get('/', ensureLoggedIn, (req, res) => {
        res.render('home', { user: req.user });
    });
    
    router.get('/login', (req, res) => {
        res.render('login');
    });

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    });
    
    router.get('/register', (req, res) => {
        res.render('register');
    });
    
    // router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
    //     res.redirect('/');
    // });
    router.post('/login', passport.authenticate('local', {
        sucessRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    router.post('/register', (req, res) => {
        let param = req.body;
        if(param && param.name && param.password){
            bcrypt.hash(param.password, 10).then((hash) => {
                let user = new User({
                    userName: param.username,
                    password: hash,
                    name: param.name,
                    dob: param.dob
                });
                user.save((err, logData) => {
                    if(err){
                        res.redirect('register');
                    }else{
                        let profile = new Profile({
                            userId: logData._id,
                            dept: param.dept,
                            salary: param.salary
                        });
                        profile.save((err, resData) => {
                            if(err){
                                res.redirect('register');
                            }else{
                                res.redirect('login');
                            }
                        });
                    }
                });
            });
        }else{
            res.redirect('register');
        }
    });
    
    router.get('/profile', ensureLoggedIn, (req, res) => {
        User.find({}, (err, userData) => {
            if(err){ res.redirect('/'); }
            console.log(req.session)
            res.render('profile', {users: userData, userId: req.session.passport.user});
        });
    });
    
    router.get('/user/:id', ensureLoggedIn, (req, res) => {
        let userId = req.params.id;
        let data = {};
        if(userId){
            Profile.find({'userId': userId}, (err, profileData) => {
                if(err) { res.redirect('/profile'); }
                if(profileData){
                    if(profileData[0]){
                        data.profile = profileData[0];
                        User.find({'_id': userId}, (err, userData) => {
                            if(err) { res.redirect('/profile'); }
                            data.user = userData[0];
                            res.render('user-profile', {data: data, userId:req.session.passport.user});
                        });
                    }
                }
            });
        }else{
            res.render('home');
        }
    })
    
    return router;
};