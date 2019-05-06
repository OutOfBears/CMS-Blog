import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Config, GetPopularPosts } from '../api';

import Identicon from 'react-identicons';


class Posts extends React.Component {
    state = {
        isLoading: false,
        posts: []
    }

    componentWillMount() {
        this.updatePosts();
    }
    
    updatePosts = () => {
        this.setState({ isLoading: true });
        GetPopularPosts(8, (success, data) => {
            if(success) {
                this.setState({ posts: data });
            } else {
                console.error(success, data);
            }

            this.setState({ isLoading: false });
        })
    }

    formatDate = (date) => {
        return new Date(date).toDateString();
    }
    

    redirectToPost = (post, isUser) => (e) => {
        var node = e.target;
        var creator = ReactDOM.findDOMNode(this.creator);
        console.log(!node.contains(e.target), node !== creator, e.target, creator);

        if(isUser)
            this.props.history.push(`/users/${post.author.id}`);
        else
            this.props.history.push(`/posts/${post._id}`);
    }

    renderPost = (post, idx) => {
        return (
            <div id="post-thumb" key={idx} >
                <div id="post-thumb-info" onClick={this.redirectToPost(post, false)}>
                    <div id="post-thumbnail">
                        <img src={`${Config.baseUrl}${post.thumbnail}`} alt="Post Thumbnail" />
                    </div>
                    <div id="post-thumb-title">{post.title}</div>
                    <div id="post-thumb-desc">{this.formatContent(post.content)}</div>
                </div>
                <div id="post-thumb-creator" onClick={this.redirectToPost(post, true)}>
                    <div id="post-thumb-creator-img">
                        <Identicon 
                            size="30"
                            string={post.author.username}
                        />
                        {/* <img src="https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg" alt="User profile" /> */}
                    </div>
                    <div id="post-thumb-creator-info">
                        <span>
                            {post.author.username}
                        </span>
                        <span id="post-thumb-create-date">
                            {this.formatDate(post.created_at)}
                        </span>
                    </div>
                </div> 
            </div>
        );
    }

    render() {
        const { posts } = this.state;

        if(posts.length < 1)
            return (
                <>
                    <div id="no-posts-overlay">
                        <FontAwesomeIcon icon={faFolderOpen} />
                        No Posts Yet
                    </div>
                    <div id="no-posts-placeholder" />
                </>
            );

        return (
            <div id="bg-inner-wrapper">
                <div id="posts-wrapper">
                    {posts.map((d, i) => this.renderPost(d, i))}
                </div>
            </div>
        );
    }
}
  
export default Posts;