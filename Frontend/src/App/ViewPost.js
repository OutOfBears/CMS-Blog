import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Identicon from 'react-identicons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faEye } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from './Context/UserContext';
import { GetPost, DeletePost } from '../api';


class Post extends React.Component {
    state = {
        postId: '',
        postViews: 0,
        postTitle: '',
        postContent: '',
        postCreatedAt: new Date(),
        postAuthor: { 
            id: '', 
            username: ''
        },

        isLoading: false,

    }

    componentWillMount() {
        const { match, history } = this.props;

        if(typeof match.params.id !== 'string'
            || match.params.id.trim() === '')
            return history.push('/');

        this.loadPost(match.params.id);
    }


    loadPost = (id) => {
        this.setState({ isLoading: true });
        
        GetPost(id, (success, data) => {
            if(success) {
                console.log("got post", success, data);
                this.setState({
                    postId: id,
                    postViews: data.views,
                    postTitle: data.title,
                    postContent: data.content,
                    postCreatedAt: new Date(data.created_at),
                    postAuthor: data.author,
                    isLoading: false
                })
            } else {
                console.error("ERROR GETTING POST", success, data);
                this.props.history.push('/');
            }
        });
    }

    deletePost = () => {
        DeletePost(this.state.postId, (success, data) => {
            if(success)
                this.props.history.push('/');
        })
    }

    formatDate = (date) => {
        return date.toDateString();
    }

    render() {
        const {
            isLoading,
            postViews,
            postTitle,
            postContent,
            postCreatedAt,
            postAuthor
        } = this.state;

        return (
            <div id="bg-inner-wrapper">
                {isLoading && 
                    <div id="post-loading">
                        <FontAwesomeIcon icon={faCircleNotch} spin />
                    </div>
                }
                {!isLoading && 
                    <div id="post-wrapper">
                        <div id="post-title-wrap">
                            <h3 id="post-title">
                                {postTitle}
                            </h3>
                            <UserContext.Consumer>
                                {(ctx) => (
                                    <>  
                                    {console.log(ctx.user.id, postAuthor.id)}
                                        {ctx.user.id === postAuthor.id &&
                                            <button id="post-delete" onClick={this.deletePost}>
                                                Delete
                                            </button>
                                        }
                                    </>
                                )}
                            </UserContext.Consumer>
                        </div>
                        <div id="post-content">
                            <ReactMarkdown 
                                source={postContent}
                                linkTarget={"_blank"}
                                escapeHtml
                            />
                        </div>
                        <div className="post-fix" id="post-creator">
                            <div className="post-fix" id="post-thumb-creator">
                                <div id="post-thumb-creator-img">
                                    <Identicon 
                                        size="30"
                                        string={postAuthor.username}
                                    />
                                </div>
                                <div id="post-thumb-creator-info">
                                    <span>
                                        {postAuthor.username}
                                    </span>
                                    <span id="post-thumb-create-date">
                                        {this.formatDate(postCreatedAt)}
                                    </span>
                                </div>
                            </div>
                            <div id="post-views">
                                <FontAwesomeIcon icon={faEye} />
                                {postViews}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
  
export default Post;