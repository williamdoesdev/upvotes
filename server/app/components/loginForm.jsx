import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./form.jsx";
import { login } from "../services/userService";
import { checkToken } from "../services/userService";

export default class LoginUser extends Form {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: "",
        password: "",
      },
      errors: {},
      signedIn: this.props.signedIn,
    };

    this.handleSubmit = this.handleSubmit.bind(this);

    this.validateSchema = {
      email: Joi.string().required(),
      password: Joi.string().required(),
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && token) {
      console.log("token is good");
      checkToken(token).then((res) => {
        if (res.status === 200) {
          this.props.onLogin(user);
        }
      });
    }
  }

  render() {
    return (
      <div className="registerForm">
        <form ref={this.formRef} onSubmit={this.handleValidate}>
          <input
            name="email"
            onChange={this.handleChange}
            className="registerFormInput"
            placeholder="Email"
          ></input>
          <input
            name="password"
            onChange={this.handleChange}
            className="registerFormInput"
            placeholder="Password"
          ></input>
          <button
            className="registerFormSubmit"
            id="loginFormSubmit"
            type="submit"
            onClick={this.handleSubmit}
          >
            Login
          </button>
          <p>
            Try these test users:
            <br />
            <br />
            <b>Admin:</b>
            <br />
            admin@test.com
            <br />
            password1
            <br />
            <br />
            <b>User:</b>
            <br />
            user@test.com
            <br />
            password1
          </p>
        </form>
      </div>
    );
  }

  async handleSubmit() {
    const payload = {};
    Object.assign(payload, this.state.formData);
    try {
      const res = await login(payload);
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log(`token: ${data.token}`);

      this.props.onLogin(data.user);

      const emptyForm = { email: "", password: "" };
      this.setState({ formData: emptyForm });
    } catch (error) {
      console.log("failed hello");
      console.log(error.message);
    }
  }
}
