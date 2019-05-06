import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faSync, faBars } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from './Context/UserContext';

import UserBar from './UserBar';

class Navbar extends React.Component {
    state = {
        displaySmMenu: false
    }

    componentWillMount() {
        document.body.addEventListener('click', 
            this.documentBodyClick);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click',
            this.documentBodyClick);
    }
    
    changeSmState = (state) => {
        if(state) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = '';
        }

        this.setState({ 
            displaySmMenu: state
        })
    }

    documentBodyClick = (e) => {
        const { displaySmMenu } = this.state;
        if(!displaySmMenu) return;

        if(!ReactDOM.findDOMNode(this.smNavBar)
            .contains(e.target)) 
            this.changeSmState(false);
    }

    
    navbarClick = (e) => {
        if(ReactDOM.findDOMNode(this.smNavBar)
            .contains(e.target) && e.target.nodeName === 'A')
            this.changeSmState(false);
    }

    displayMenu = (e) => {
        this.changeSmState(true);
    }


    renderLoggedInLinks = (context, small = false) => {
        return (
            <>
                {context.isLoading &&
                    <FontAwesomeIcon id="navbar-loading-icon" icon={faSync} spin />
                }
                {!context.isLoggedIn() && !small &&
                    <>
                        <Link id="navbar-button" to="/signup">Sign-up</Link>
                        <Link id="navbar-button-primary" to="/login">Login</Link>
                    </>
                }
                {!context.isLoggedIn() && small &&
                    <>
                        <Link id="navbar-button-primary" to="/login">Login</Link>
                        <Link id="navbar-button" to="/signup">Sign-up</Link>
                    </>
                }
                {context.isLoggedIn() &&
                    <>
                        <Link id="navbar-button-primary" to="/create_post">Create Post</Link>
                        {!small && 
                            <UserBar user={context.user} />
                        }
                    </>
                }
            </>
        )
    }

    renderLinks = () => {
        return (
            <>
                <Link to="/posts">Posts</Link>
                <Link to="/users">Users</Link>
            </>
        );
    }

    render() {
        const { displaySmMenu } = this.state; 
        return (
            <div id="navbar-container" onClick={this.navbarClick}>
                <Link id="navbar-header" to="/">
                    <FontAwesomeIcon id="navbar-icon" icon={faBlog} />
                    <span>Jack's Blog</span>
                </Link>

                <div 
                    id="navbar-links-sm-wrapper"
                    style={{display: displaySmMenu ? 'flex' : 'none'}}
                >
                    <div id="navbar-links-sm" 
                        ref={ref => this.smNavBar = ref}
                    >
                        <UserContext.Consumer>
                            {(ctx) => 
                                <>
                                    {ctx.isLoggedIn() &&
                                        <UserBar user={ctx.user} small={true} />
                                    }
                                    {this.renderLoggedInLinks(ctx, true)}
                                    {this.renderLinks()}
                                </>
                            }
                        </UserContext.Consumer>
                    </div>
                </div>

                <div id="navbar-links-sm-b">
                    <button onClick={this.displayMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>

                <div id="navbar-links">
                    {this.renderLinks()}
                    <UserContext.Consumer>
                        {(ctx) => this.renderLoggedInLinks(ctx)}
                    </UserContext.Consumer>
                </div>
            </div>
        );
    }
}
  
export default Navbar;