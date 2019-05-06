import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LoginAsync } from '../api';
import { UserContext } from './Context/UserContext';

class Login extends React.Component {
    state = {
        user: '',
        password: '',
        error: ''
    }
    
    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    }

    onSubmit = (context) => (e) => {
        const { user, password } = this.state;

        e.preventDefault();

        LoginAsync(user, password, (good, data) => {
            if(!good) {
                this.setState({ error: data });
                return;
            }
            else {
                context.loadUser(data.user);
            }
        });
    }


    render() {
        const { user, password, error } = this.state;

        return (
            <div id="auth-container">
                <div id="auth">
                    <h3 id="auth-title">Login</h3>
                    {error !== '' && 
                        <div id="auth-error">
                            Error: {error}
                        </div>
                    }
                    <UserContext.Consumer>
                        {(context) => (
                            <form onSubmit={this.onSubmit(context)}>
                                <label>
                                    Username / Email
                                    <input type="text" name="user" autoFocus required
                                        value={user} onChange={this.handleChange("user")} />
                                </label>
                                <label>
                                    Password
                                    <input type="password" name="password" required
                                        value={password} onChange={this.handleChange("password")} />
                                </label>
                                <Link to="/forgot-password">Forgot your password?</Link>
                                <input type="submit" id="auth-submit-button" value="Login" />
                                {context.isLoggedIn() && <Redirect to="/" />}
                            </form>
                        )}
                    </UserContext.Consumer>
                </div>
            </div>
        );
    }
}
  
export default Login;