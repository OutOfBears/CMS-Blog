import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog } from '@fortawesome/free-solid-svg-icons';

class Navbar extends React.Component {
    state = {
        loggedIn: false
    }

    componentWillMount() {

    }

    render() {
        const { loggedIn } = this.state;

        return (
            <div id="navbar-container">
                <Link id="navbar-header" to="/">
                    <FontAwesomeIcon id="navbar-icon" icon={faBlog} />
                    <span>Jack's Blog</span>
                </Link>

                <div id="navbar-links">
                    <Link to="/posts">Posts</Link>
                    <Link to="/users">Users</Link>
                    
                    {!loggedIn &&
                        <>
                            <Link id="navbar-button" to="/signup">Sign-up</Link>
                            <Link id="navbar-button-primary" to="/login">Login</Link>
                        </>
                    }
                </div>
            </div>
        );
    }
}
  
export default Navbar;