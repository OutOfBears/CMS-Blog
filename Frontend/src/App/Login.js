import React from 'react';
import { Link } from 'react-router-dom';
import { LoginAsync, GetCookie } from '../api';
import Cookies from 'js-cookie';

class Login extends React.Component {
    state = {
        user: '',
        password: '',
        error: ''
    }
    
    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    }

    onSubmit = (e) => {
        const { user, password } = this.state;

        e.preventDefault();

        LoginAsync(user, password, (good, data) => {
            if(!good) {
                this.setState({ error: data });
                return;
            }
            else {
                console.log(Cookies.get("BLOG-AUTH"));
                if(Cookies.get("BLOG-AUTH") !== "") {
                    window.localStorage.setItem("user", 
                        user);

                    // this.props.history.push("/");
                } else {
                    console.log("no cookie :L",GetCookie("BLOG-AUTH"));
                    this.setState({ error: "invalid auth response" });
                }
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
                    <form onSubmit={this.onSubmit}>
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
                        
                    </form>
                </div>
            </div>
        );
    }
}
  
export default Login;