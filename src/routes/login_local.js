var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/login/', function (req, res, next) {
    if (req.session.passport) res.redirect('/web-app/');
    else res.render('login_local', {title: 'Admin Login'});

});
/* Handle Login POST */
router.post('/login',
    passport.authenticate('login', {
        successRedirect: '/web-app/',
        failureRedirect: '/login/',
        failureFlash: true
    })
);
/* Handle Logout */
router.get('/logout/', function (req, res) {
    if (req.session.passport) console.info("\x1b[32minfo\x1b[0m:","User " + req.session.passport.user.email+ " is now logged out.");
    req.logout();
    req.session.destroy();
    res.redirect('/login/');
});
module.exports = router;