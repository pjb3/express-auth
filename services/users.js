var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://localhost/auth";

module.exports = {
  findByEmailAddress: function(emailAddress, cb) {
    pg.connect(conString, function(err, client, done) {
      if (err) {
        console.log(err);
        throw(err);
      }
      client.query('SELECT * FROM users WHERE email_address = $1', [emailAddress], function(err, result) {
        done();
        if (err) {
          console.log(err);
          throw(err);
        }

        cb(result.rows[0]);
      });
    });
  },

  createUser: function(user, cb) {
    pg.connect(conString, function(err, client, done) {
      if (err) {
        console.log(err);
        throw(err);
      }

      client.query('INSERT INTO users (email_address, password, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING id', [user.emailAddress, user.password], function(err, result) {
        done();
        if (err) {
          console.log(err);
          throw(err);
        }

        user.id = result.rows[0].id;
        cb(user);
      });
    });
  }
}
