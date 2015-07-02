var express = require('express')
var router = express.Router()
var users = require('../services/users')

/* GET home page. */
router.get('/', function(req, res) {
  if(req.signedCookies.userId) {
    console.log("Looking for user with ID="+req.signedCookies.userId)
    users.findById(req.signedCookies.userId, function(user){
      if(user) {
        console.log("Logged in as "+ user.emailAddress)
      } else {
        console.log("Could not find user with ID="+req.signedCookies.userId)
      }
      res.render('index', { currentUser: user })
    })
  } else {
    console.log("Not Logged in")
    res.render('index')
  }
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

module.exports = router
