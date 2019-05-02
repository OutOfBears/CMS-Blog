import React from 'react';
import { Link } from 'react-router-dom';

class Register extends React.Component {
    state = {
        user: '',
        email: '',
        password: '',
        error: ''
    }
    
    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const { email, password } = this.state;
    
        // fetch('/api/auth/login')
            
        console.log("SUBMIT", email, password);
    }

    render() {
        const { user, email, password, error } = this.state;

        return (
            <div id="auth-container">
                <div id="auth">
                    <h3 id="auth-title">Register</h3>
                    {error !== '' && 
                        <div id="auth-error">
                            Error: {error}
                        </div>
                    }
                    <form onSubmit={this.onSubmit}>
                        <label>
                            Username
                            <input type="text" name="username" required
                                value={user} onChange={this.handleChange("user")} />
                        </label>
                        <label>
                            Email
                            <input type="email" name="email" autoFocus required
                                value={email} onChange={this.handleChange("email")} />
                        </label>
                        <label>
                            Password
                            <input type="password" name="password" required
                                value={password} onChange={this.handleChange("password")} />
                        </label>
                        <div id="register-caption">By registering you are agreeing to the Terms of Service.</div>
                        <input type="submit" id="auth-submit-button" value="Continue" />
                        
                    </form>
                </div>
            </div>
        );
    }
}
  
export default Register;