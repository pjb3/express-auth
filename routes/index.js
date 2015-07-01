var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://localhost/auth";

/* GET home page. */
router.get('/', function(req, res, next) {
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

module.exports = router;
