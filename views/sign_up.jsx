var React = require('react');
var Layout = require('./layout');

var SignUp = React.createClass({
  render: function() {
    return (
      <Layout>
        <div className="container">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Sign Up</h3>
            </div>
            <div className="panel-body">
              <form method="post" action="/sign_up">
                <div className="form-group">
                  <label for="email">Email address</label>
                  <input type="email" className="form-control" id="email" placeholder="Email" name="email" />
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" name="password" />
                </div>
                <button type="submit" className="btn btn-success">Sign up</button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
})

module.exports = SignUp;
