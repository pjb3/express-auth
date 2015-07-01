var React = require('react');

var Homepage = React.createClass({
  render: function() {
    return <h1>User Count: {this.props.userCount}</h1>;
  }
})

module.exports = Homepage;
