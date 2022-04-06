import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./form.jsx";

export default class AddTopic extends Form {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: "",
        description: "",
      },
      errors: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);

    this.validateSchema = {
      name: Joi.string().required(),
      description: Joi.string(),
    };
  }

  render() {
    return (
      <div className="addTopicFormContainer">
        <form onSubmit={this.handleValidate}>
          <input
            name="name"
            value={this.state.formData.name}
            onChange={this.handleChange}
            className="addTopicFormInput"
            placeholder="Category Name"
          ></input>
          <input
            name="description"
            value={this.state.formData.description}
            onChange={this.handleChange}
            className="addTopicFormInput"
            placeholder="Category Description"
          ></input>
          {this.renderErrors()}
          <button className="addTopicFormSubmit" id="addTopicFormSubmit">
            Add New Category
          </button>
        </form>
      </div>
    );
  }

  renderErrors() {
    if (Object.keys(this.state.errors).length > 0) {
      const errorsMarkup = Object.keys(this.state.errors).map((key) => (
        <p key={this.state.errors[key]}>{this.state.errors[key]}</p>
      ));
      return <div className="formErrorsDiv">{errorsMarkup}</div>;
    }
  }

  async handleSubmit() {
    const res = await fetch("http://localhost:5001/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(this.state.formData),
    });
    const data = await res.json();
    this.props.onNewCategory(data);

    const newFormData = {
      name: "",
      description: "",
    };
    this.setState({ formData: newFormData });
  }
}
