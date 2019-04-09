import React from "react";
import { BrowserRouter as Router, Link, Route, } from 'react-router-dom';
import Main from './components/main';
import Login from './components/login';
import Register from './components/register';
import Todos from './components/todos';
import TodoList from './components/todolist';
import { token$, email$, updateToken } from "./components/auth";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      email: null,
    }
    this.logOut = this.logOut.bind(this);

    this.subscriptions = [];
  }
  componentDidMount() {
    this.subscriptions.push(token$.subscribe((token) => {
      this.setState({ token });
    }));

    this.subscriptions.push(email$.subscribe((email) => {
      this.setState({ email });
    }));
  }

  componentWillUnmount() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  logOut() {
    updateToken(null);
  }

  render() {
    return (
      <Router>
        <div>
          <div className="navbar">
            <Link className="active" to="/"><i className="fa fa-fw fa-home"></i>  HOME </Link>

            {this.state.token ? (<Link to="/todos"><i className="fas fa-paste"></i> TODO LIST </Link>) : null}
            <div className="user__name"> 
            {this.state.token ? <p><i className="fas fa-user-edit"></i> Logged in as {this.state.email} <i className="fas fa-caret-down"></i></p> :(null)}
            </div>
            {this.state.token ? <button onClick={this.logOut}><i className="fas fa-sign-out-alt"></i> SIGN OUT </button> : <Link to="/login"><i className="fas fa-sign-in-alt"></i> SIGN IN </Link>}
            {this.state.token ? (null) : <Link to="/register"><i className="fa fa-fw fa-user"></i> REGISTER </Link>}


          </div>


          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/todos" component={Todos} />
        </div>
      </Router>
    )
  }
}

export default App;
