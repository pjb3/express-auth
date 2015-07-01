var express = require('express');
var router = express.Router();
var users = require('../services/users');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/sign_up', function(req, res) {
  res.render('sign_up');
});

router.post('/sign_up', function(req, res) {
  console.log('Looking for email='+req.body.emailAddress);
  users.findByEmailAddress(req.body.emailAddress, function(user) {
    if(user) {
      res.render('sign_up', { emailAddress: req.body.emailAddress, error: 'User already exists' });
    } else{
      users.createUser({ emailAddress: req.body.emailAddress, password: req.body.password }, function(user){
        console.log("User "+user.id+" created");
        res.redirect('/');
      });
    }
  });
});

module.exports = router;
