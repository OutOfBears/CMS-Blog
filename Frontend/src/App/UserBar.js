import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Identicon from 'react-identicons';

import { UserContext } from './Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

class UserBar extends React.Component {
    state = {
        barOpen: false
    }

    componentWillMount() {
        document.body.addEventListener('click', 
            this.documentBodyClick);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click',
            this.documentBodyClick);
    }
    
    documentBodyClick = (e) => {
        const { barOpen } = this.state;
        if(!barOpen) return;

        if(!ReactDOM.findDOMNode(this.ref)
            .contains(e.target)) 
            this.setState({ barOpen: false });
    }

    userPfpBarClick = (e) => {
        const { barOpen } = this.state;

        this.setState({
            barOpen: !barOpen
        });
    }

    logOut = (context) => (e) => {
        context.logOut();
    }

    render() {
        const { barOpen } = this.state;
        const { user, small } = this.props;

        const isSmall = typeof small === 'boolean'
            && small === true

        return (
            <div 
                id="user-pfp-bar"
                className={isSmall ? 'user-pfp-bar-sm' : ''}
                onClick={this.userPfpBarClick} 
                ref={ref => this.ref = ref}
            >
                {barOpen &&
                    <div id="user-pfp-links">
                        <div id="placeholder" />
                        <UserContext.Consumer>
                            {(context) => (
                                <Link id="link-important" to="/" onClick={this.logOut(context)}>
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    Logout
                                </Link>
                            )}
                        </UserContext.Consumer>
                        <div id="placeholder" />
                    </div>
                }
                <div id="user-pfp-wrapper">
                    <Identicon 
                        size="32"
                        string={user.username}
                    />
                    <span>{user.username}</span>
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
            </div>
        );
    }
}
  
export default UserBar;