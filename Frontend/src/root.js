import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import {createBrowserHistory} from "history";

import './App/index.css';

// layout components
import Navbar from './App/Navbar';

// Bad device
import Unsupported from './App/Unsupported';

// page components
import Portal from './App/Portal';
import Login from './App/Login';
import Register from './App/Register';
import ViewUser from './App/ViewUser';
import ViewPost from './App/ViewPost';
import CreatePost from './App/CreatePost';
import ViewPosts from './App/Posts';
import ViewUsers from './App/Users';

// contexts
import { UserProvider } from './App/Context/UserContext';

const browserHistory = createBrowserHistory();



class App extends React.Component {
    componentWillMount() {
        // I don't feel like passing it down the DOM (not efficient)
        window.browserHistory = browserHistory;
    }

    render() {
        return (
            <UserProvider>
                <Unsupported />
                <div id="bg-wrapper">
                    <Router history={browserHistory}>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={Portal} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/signup" component={Register} />
                            <Route exact path="/create_post" component={CreatePost} />
                            <Route exact path="/posts" component={ViewPosts} />
                            <Route exact path="/users" component={ViewUsers} />
                            <Route path="/posts/:id" component={ViewPost} />
                            <Route path="/users/:id" component={ViewUser} />
                        </Switch>
                    </Router>
                </div>
            </UserProvider>
        );
    }
}
  
export default App;