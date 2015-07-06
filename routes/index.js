var express = require('express')
var router = express.Router()
var users = require('../services/users')

function loadUser(req, res, next) {
  if(!req.signedCookies.userId)
    return next()

  console.log("Looking for user with ID="+req.signedCookies.userId)
  users.findById(req.signedCookies.userId, function(user){
    if(user) {
      console.log("Logged in as "+ user.emailAddress)
      req.user = user
    } else {
      console.log("Could not find user with ID="+req.signedCookies.userId)
    }
    next()
  })
}

/* GET home page. */
router.get('/', loadUser, function(req, res) {
  res.render('index', { currentUser: req.user })
})

router.get('/sign_up', function(req, res) {
  res.render('sign_up')
})

router.post('/sign_up', function(req, res) {
  console.log('Looking for email='+req.body.emailAddress)
  users.findByEmailAddress(req.body.emailAddress, function(user) {
    if(user) {
      res.render('sign_up', { emailAddress: req.body.emailAddress, error: 'User already exists' })
    } else {
      users.createUser({ emailAddress: req.body.emailAddress, password: req.body.password }, function(user){
        console.log("User "+user.id+" created")
        res.cookie('userId', user.id, { signed: true }).redirect('/')
      })
    }
  })
})

router.get('/log_in', function(req, res) {
  res.render('log_in')
})

router.post('/log_in', function(req, res) {
  users.authenticate(req.body.emailAddress, req.body.password, function(user) {
    if(user) {
      res.cookie('userId', user.id, { signed: true }).redirect('/')
    } else {
      res.render('log_in', { emailAddress: req.body.emailAddress, error: 'Log In Failed' })
    }
  })
})

router.get('/log_out', function(req, res) {
  res.clearCookie('userId').redirect('/')
})

router.get('/forgot_password', function(req, res) {
  res.render('forgot_password')
})

router.post('/forgot_password', function(req, res) {
  users.findByEmailAddress(req.body.emailAddress, function(user) {
    if(user) {
      req.app.mailer.send('password_reset_email.ejs', {
        to: user.emailAddress,
        subject: 'Password Reset Instructions',
        resetLink: 'http://'+req.app.get('default_host')+'/reset_password'
      }, function (err) {
        if (err) {
          console.log(err);
          res.send('There was an error sending the email');
          return;
        }
        res.redirect('/password_reset_sent')
      });
    } else {
      res.render('forgot_password', { emailAddress: req.body.emailAddress, error: 'Account not found' })
    }
  })
})

router.get('/password_reset_sent', function(req, res) {
  res.render('password_reset_sent')
})

module.exports = router
