import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { GetUsers } from '../api';

import Identicon from 'react-identicons';
import Pagination from './Helper/Pagination';

class Users extends React.Component {
    state = {
        limit: 10,
        total: 0,
        index: 0,

        isLoading: false,

        users: []
    }
    
    componentWillMount() {
        const params = new URLSearchParams(this.props.location.search
            || '');
        const idx = Number(params.get('idx'));
        if(typeof idx === 'number' && !isNaN(idx)
            && idx > 1) {
            this.setState({ 
                index: (idx - 1) * 15
            }, () => this.updateUsers(true));
        } else {
            this.updateUsers();
        }
    }
    
    onUpdateIndex = (index, shouldFetch) => {
        const { limit } = this.state;

        if(shouldFetch){
            this.setState({ index }, () => 
                this.updateUsers());
        } else {
            this.setState({ index });
        }
        this.props.history.push(`/users?idx=${Math.floor(index / limit) + 1}`);
    }
    
    updateUsers = (ignoreEmpty = false) => {
        const { 
            limit,
            index
         } = this.state;

        this.setState({ isLoading: true });
        GetUsers(index, limit, (success, res) => {
            if(success) {
                if(ignoreEmpty &&
                    res.data.length === 0)
                {
                    return this.onUpdateIndex(0, true);
                } else {
                    this.setState({ 
                        total: res.totalAmount || limit,
                        users: res.data
                    });
                }
            } else {
                console.error(success, res);
            }

            this.setState({ isLoading: false });
        })
    } 
    redirectToUser = (user) => (e) => {
        this.props.history.push(`/users/${user._id}`);
    }

    renderUser = (user, idx) => {
        return (
            <div id="users-view-item" key={idx} onClick={this.redirectToUser(user)}>
                <div id="users-view-avatar">
                    <Identicon 
                        size="30"
                        string={user.username}
                    />
                </div>
                <div id="users-view-username">
                    {user.username}
                </div>
            </div>
        );
    }

    render() {
        const { 
            users,
            limit,
            total,
            index,
            isLoading
        } = this.state;

        if(users.length < 1 && !isLoading)
            return (
                <>
                    <div id="no-posts-overlay">
                        <FontAwesomeIcon icon={faFolderOpen} />
                        No Users Yet
                    </div>
                    <div id="no-posts-placeholder" />
                </>
            );

        return (
            <>
                <div id="bg-inner-wrapper">
                    {isLoading && 
                        <div id="post-loading">
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                        </div>
                    }
                    {!isLoading && 
                        <div id="users-wrapper">
                            {users.map((d, i) => this.renderUser(d, i))}
                        </div>
                    }
                </div>
                {!isLoading &&
                    <Pagination 
                        index={index}
                        limit={limit}
                        total={total}
                        updateIndex={this.onUpdateIndex}
                    />
                }
            </>
        );
    }
}
  
export default Users;