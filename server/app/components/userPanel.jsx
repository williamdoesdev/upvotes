import React, { Component } from "react";
// import UserServices from '../services/userServices.js';
import userIcon from "../img/user.svg";
import RegisterForm from "./registerForm.jsx";
import LoginForm from "./loginForm.jsx";
import UserInfo from "./userInfo.jsx";

export default class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: true,
      signedIn: false,
      user: {},
    };
    this.renderContent = this.renderContent.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="userContainer">
        <div>
          <div className="userPanelBG" />
          <input
            className="userIcon"
            onClick={this.togglePanel}
            type="image"
            src={userIcon}
          />
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    if (this.state.panelOpen) {
      if (this.state.signedIn == true) {
        return <UserInfo user={this.state.user} onLogout={this.handleLogout} />;
      } else {
        return (
          <div className="userPanel">
            <RegisterForm />
            <LoginForm user={this.state.user} onLogin={this.handleLogin} />
          </div>
        );
      }
    } else {
      return null;
    }
  }

  togglePanel() {
    this.setState({ panelOpen: !this.state.panelOpen });
    // console.log(this.state.panelOpen);
  }

  handleLogin(data) {
    console.log("hellofromhandlelogin");
    const newUserState = {};
    Object.assign(newUserState, this.state.user);
    newUserState.email = data.email;
    newUserState.username = data.username;
    this.setState({ signedIn: true, user: newUserState });
    this.props.onPassUser(newUserState);
  }

  handleLogout() {
    this.setState({ signedIn: false });
    this.props.onPassUser({});
    localStorage.clear();
  }
}
