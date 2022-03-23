import React, { Component } from "react";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    };
  }

  render() {
    return (
      <div className="userInfo">
        <p>
          <b>Logged in as:</b>
        </p>
        <p>{this.state.user.email}</p>
        <p>{this.state.user.username}</p>
        <button
          className="addTopicFormSubmit"
          id="logOutButton"
          type="button"
          onClick={this.props.onLogout}
        >
          Log Out
        </button>
      </div>
    );
  }
}
