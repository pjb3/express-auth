var express = require('express');
var router = express.Router();
var pg = require('pg');
var users = require('../services/users');
var conString = process.env.DATABASE_URL || "postgres://localhost/auth";

/* GET home page. */
router.get('/', function(req, res) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.error('error fetching client from pool', err);
      res.status(500).send('Could not connect to database');
      return;
    }

    client.query('SELECT count(*) AS "userCount" from users', function(err, result) {
      done();
      if (err) {
        console.error('error running query', err);
        res.status(500).send('Error running query');
      } else {
        res.render('index', { userCount: result.rows[0].userCount });
      }
    });
  });
});

router.get('/sign_up', function(req, res) {
  res.render('sign_up');
});

router.post('/sign_up', function(req, res) {
  console.log('Looking for email='+req.body.email);
  users.findByEmailAddress(req.body.email, function(user) {
    if(user) {
      res.render('sign_up', { email: req.body.email, error: 'User already exists' });
    } else{
      users.createUser({ email: req.body.email, password: req.body.password }, function(user){
        console.log("User "+user.id+" created");
        res.redirect('/');
      });
    }
  });
});

module.exports = router;
