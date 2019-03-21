import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import './App.css';
import { Login } from './pages/';
import { SignUp } from './pages/';

import Requests from './services/requests';
import DefaultLayout from './containers/DefaultLayout';

class App extends Component {
  componentWillMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
    }
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={() => <Login />} />
          <Route exact path="/signup" name="SignUp Page" component={() => <SignUp />} />
          <Route path="/" name="Home" render={props => this.props.user != null ? (<DefaultLayout />) : (<Redirect to="/login" />)} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
