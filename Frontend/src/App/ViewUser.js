import React from 'react';
import Identicon from 'react-identicons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { GetUser } from '../api';


import Posts from './Posts';

class User extends React.Component {
    state = {
        id: '', 
        posts: 0,
        username: '',
        registered: new Date(),

        isLoading: false,

    }

    componentWillMount() {
        const { match, history } = this.props;

        if(typeof match.params.id !== 'string'
            || match.params.id.trim() === '')
            return history.push('/');

        this.loadUser(match.params.id);
    }


    loadUser = (id) => {
        this.setState({ isLoading: true });
        
        GetUser(id, (success, data) => {
            if(success) {
                console.log("got user", success, data);
                this.setState({
                    id,
                    posts: 0,
                    username: data.username,
                    registered: new Date(data.created_at),

                    isLoading: false
                })
            } else {
                console.error("ERROR GETTING USER", success, data);
                this.props.history.push('/');
            }
        });
    }

    formatDate = (date) => {
        return date.toDateString();
    }

    render() {
        const {
            id,
            posts,
            username,
            registered,

            isLoading
        } = this.state;

        return (
            <>
                <div id="bg-inner-wrapper" style={{marginBottom: 0}}>
                    {isLoading && 
                        <div id="post-loading">
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                        </div>
                    }
                    {!isLoading && 
                        <div id="user-wrapper">
                            <Identicon 
                                size="100"
                                string={username}
                            />
                            <div id="user-info">
                                <h1>{username}</h1>
                                <span><b>Posts:</b> {posts}</span>
                                <span><b>Registered:</b> {this.formatDate(registered)}</span>
                            </div>
                        </div>
                    }
                </div>
                {!isLoading && id !== '' &&
                    <>
                        <Posts
                            user={id}
                            url={`/users/${id}`}
                            noUser
                            noRel

                            {...this.props}
                        >
                            <h3 id="user-posts">
                                User Posts
                            </h3>
                        </Posts>
                    </>
                }
            </>
        );
    }
}
  
export default User;