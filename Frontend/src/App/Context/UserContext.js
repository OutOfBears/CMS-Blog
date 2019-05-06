import React, { Component } from 'react';
import { DownloadUser, LogoutAsync } from '../../api';

export const UserContext = React.createContext();

export class UserProvider extends Component {
    state = {
        user: {
            id:         '',
            username:   ''
        },

        isLoading: false,

        logOut: this.logOut.bind(this),
        isLoggedIn: this.isLoggedIn.bind(this),
        loadUser: this.loadUser.bind(this),
        updateUser: this.updateUser.bind(this)
    }

    logOut() {
        LogoutAsync();
        
        this.state({ 
            user: {
                id: '',
                username: ''
            }
        });
    }

    isLoggedIn() {
        const { user, isLoading } = this.state;

        return (
            user.id !== '' && 
            user.username !== '' &&
            !isLoading
        );
    }

    loadUser(newUserInfo) {
        let user = this.state.user;
        Object.assign(user, newUserInfo);
        this.setState({ user });
    }

    updateUser(loading = true){
        if(loading === true)
            this.setState({ isLoading: true })

        DownloadUser((success, data) => {
            if(success) {
                this.loadUser(data.user);
            }

            this.setState({ isLoading: false })
        });
    }

    componentWillMount() {
        this.updateUser(true);
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}
