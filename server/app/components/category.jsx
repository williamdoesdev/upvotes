import React, { Component } from "react";
import Topic from "./topic.jsx";
import AddTopic from "./addTopic.jsx";

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: this.props.name,
      categoryDescription: this.props.description,
      categoryId: this.props._id,
      topics: [],
    };
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleNewTopic = this.handleNewTopic.bind(this);
  }

  async componentDidMount() {
    const res = await fetch("https://williamdoes.dev/upvotes/api/topics");
    let data = await res.json();
    data = data.filter((topic) => topic.category._id == this.state.categoryId);
    this.setState({ topics: data });
  }

  render() {
    return (
      <div className="categoryContainer">
        <div className="categoryTitleDiv">
          <h1>{this.state.categoryName}</h1>
          <p>{this.state.categoryDescription}</p>
        </div>
        <div className="topicContainer">
          {this.state.topics.map((topic) => (
            <Topic
              key={topic.name}
              _id={topic._id}
              name={topic.name}
              description={topic.description}
              upvotes={topic.upvotes}
              onDelete={this.handleDelete}
              onUpvote={this.handleUpvote}
              currentUsername={this.props.currentUsername}
            />
          ))}
        </div>
        {this.renderAddTopic()}
      </div>
    );
  }

  renderAddTopic() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return (
        <AddTopic
          onNewTopic={this.handleNewTopic}
          categoryId={this.state.categoryId}
        />
      );
    }
  }

  handleUpvote(upvoteName, upvotesArray) {
    console.log("test");
    const newTopics = [...this.state.topics];
    const index = newTopics
      .map((c) => {
        return c.name;
      })
      .indexOf(upvoteName);
    newTopics[index].upvotes = upvotesArray;
    this.setState({ topics: newTopics });
  }

  async handleDelete(deleteId) {
    await fetch(`https://williamdoes.dev/upvotes/api/topics/${deleteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    const newTopics = this.state.topics.filter((c) => c._id != deleteId);
    this.setState({ topics: newTopics });
  }

  handleNewTopic(data) {
    const currentTopics = [...this.state.topics];
    this.setState({ topics: [...currentTopics, data] });
  }
}
