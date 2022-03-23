import React, { Component } from "react";

import upvotesArrow from "../img/upvotesArrow.svg";
import deleteIcon from "../img/deleteIcon.svg";

export default class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
    this.handleSelection = this.handleSelection.bind(this);
    // this.handleUpvote = this.handleUpvote.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div
        className={this.state.selected == 1 ? "topicGridSelected" : "topicGrid"}
      >
        <div className="topicTitleDiv">
          <h1 onClick={this.handleSelection}>{this.props.name}</h1>
          {this.renderDescription()}
        </div>
        <div className="upvotesDiv">
          {this.renderUpvoteArrow()}
          <p>{this.props.upvotes.length}</p>
        </div>
        <div>{this.renderDeleteIcon()}</div>
      </div>
    );
  }

  renderDescription() {
    if (this.state.selected == 1) {
      return <p>{this.props.description}</p>;
    }
  }

  renderUpvoteArrow() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      user &&
      this.state.selected == 1 &&
      !this.props.upvotes.includes(this.props.currentUsername)
    ) {
      return (
        <input
          onClick={() => this.handleSubmit()}
          className="upvotesArrow"
          type="image"
          src={upvotesArrow}
        />
      );
    }
  }

  renderDeleteIcon() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && this.state.selected == 1 && user.isAdmin == true) {
      return (
        <input
          onClick={() => this.props.onDelete(this.props._id)}
          className="deleteIcon"
          type="image"
          src={deleteIcon}
        />
      );
    }
  }

  handleSelection() {
    if (this.state.selected == 0) {
      this.setState({ selected: 1 });
    } else {
      this.setState({ selected: 0 });
    }
  }

  //   handleUpvote() {
  //     this.setState({ upvotes: this.props.upvotes + 1 });
  //   }

  async handleSubmit() {
    console.log("test");
    let payload = { username: this.props.currentUsername };
    const res = await fetch(
      `http://localhost:5000/api/topics/upvote/${this.props._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    this.props.onUpvote(this.props.name, data.upvotes);
  }
}
