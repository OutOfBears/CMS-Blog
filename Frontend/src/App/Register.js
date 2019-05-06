import React from 'react';
import { Redirect } from 'react-router-dom';
import { RegisterAsync } from '../api';
import { UserContext } from './Context/UserContext';

class Register extends React.Component {
    state = {
        email: '',
        username: '',
        password: '',
        error: ''
    }
    
    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    }

    onSubmit = (context) => (e) => {
        const { email, username, password } = this.state;

        e.preventDefault();
    
        RegisterAsync(username, email, password, (good, data) => {
            if(!good) {
                this.setState({ error: data });
                return;
            } else {
                console.log(good, data);

                context.loadUser(data.user);
                this.props.history.push("/");
            }
        });
    }

    render() {
        const { username, email, password, error } = this.state;

        return (
            <div id="auth-container">
                <div id="auth">
                    <h3 id="auth-title">Register</h3>
                    {error !== '' && 
                        <div id="auth-error">
                            Error: {error}
                        </div>
                    }
                    <UserContext.Consumer>
                        {(context) => (
                            <form onSubmit={this.onSubmit(context)}>
                                <label>
                                    Username
                                    <input type="text" name="username" autoFocus required
                                        value={username} onChange={this.handleChange("username")} />
                                </label>
                                <label>
                                    Email
                                    <input type="email" name="email" required
                                        value={email} onChange={this.handleChange("email")} />
                                </label>
                                <label>
                                    Password
                                    <input type="password" name="password" required
                                        value={password} onChange={this.handleChange("password")} />
                                </label>
                                <div id="register-caption">By registering you are agreeing to the Terms of Service.</div>
                                <input type="submit" id="auth-submit-button" value="Continue" />
                                {context.isLoggedIn() && <Redirect to="/" />}
                            </form>
                        )}
                    </UserContext.Consumer>
                </div>
            </div>
        );
    }
}
  
export default Register;