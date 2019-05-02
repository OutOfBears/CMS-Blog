import React from 'react';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    state = {
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
    
        this.setState({ error: 'not implemented' })

        // fetch('/api/auth/login')
            
        console.log("SUBMIT", email, password);
    }

    render() {
        const { email, password, error } = this.state;

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
                            <input type="text" name="email" autoFocus required
                                value={email} onChange={this.handleChange("email")} />
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