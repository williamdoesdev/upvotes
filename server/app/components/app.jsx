import React, { Component } from "react";
import Category from "./category.jsx";
import AddCategory from "./addCategory.jsx";
import UserPanel from "./userPanel.jsx";
import { Helmet } from "react-helmet";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      user: {},
    };
    this.handleNewCategory = this.handleNewCategory.bind(this);
    this.handlePassUser = this.handlePassUser.bind(this);
  }

  async componentDidMount() {
    const res = await fetch("https://williamdoes.dev/upvotes/api/categories");
    const data = await res.json();
    this.setState({ categories: data });
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Upvotes</title>
          <meta
            name="description"
            content="Sign in and vote on which things are the best!"
          />
        </Helmet>
        <main className="container">
          <div className="header">
            <h1>Upvotes!</h1>
            <p>Sign in and vote on which things are the best!</p>
          </div>
          <UserPanel onPassUser={this.handlePassUser} />
          <div className="categoryFlexContainer">
            {this.state.categories.map((category) => (
              <Category
                key={category._id}
                name={category.name}
                description={category.description}
                _id={category._id}
                onNewTopic={this.handleNewTopic}
                currentUsername={this.state.user.username}
              />
            ))}
          </div>
          <div className="categoryContainer">{this.renderAddCategory()}</div>
        </main>
      </React.Fragment>
    );
  }

  renderAddCategory() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.isAdmin == true) {
      return <AddCategory onNewCategory={this.handleNewCategory} />;
    }
  }

  handlePassUser(user) {
    console.log(user);
    let newUser = {};
    Object.assign(newUser, user);
    this.setState({ user: newUser });
  }

  handleNewCategory(data) {
    const newCategories = [...this.state.categories, data];
    this.setState({ categories: newCategories });
  }
}
