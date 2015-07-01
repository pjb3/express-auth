module.exports = {
  findByEmailAddress: function(emailAddress, cb) {
    if(emailAddress == 'taken@example.com') {
      cb({ id: 0, emailAddress: 'taken@example.com' });
    } else {
      cb(null);
    }
  },

  createUser: function(user, cb) {
    user.id = (new Date()).getTime();
    cb(user);
  }
}
