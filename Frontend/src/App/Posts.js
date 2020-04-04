import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { Config, GetPosts } from '../api';

import Identicon from 'react-identicons';
import Pagination from './Helper/Pagination';

class Posts extends React.Component {
    state = {
        limit: 10,
        total: 0,
        index: 0,

        isLoading: false,

        posts: []
    }

    componentWillMount() {
        const params = new URLSearchParams(this.props.location.search
            || '');
        const idx = Number(params.get('idx'));
        if(typeof idx === 'number' && !isNaN(idx)
            && idx > 1) {
            this.setState({ 
                index: (idx - 1) * 15
            }, () => this.updatePosts(true));
        } else {
            this.updatePosts();
        }
    }
    
    onUpdateIndex = (index, shouldFetch) => {
        const { limit } = this.state;

        if(shouldFetch){
            this.setState({ index }, () => 
                this.updatePosts());
        } else {
            this.setState({ index });
        }

        const idx = Math.floor(index / limit) + 1;
        if(!this.props.url)
            this.props.history.push(`/posts?idx=${idx}`);
        else
            this.props.history.push(`${this.props.url}?idx=${idx}`);
    }
    
    updatePosts = (ignoreEmpty = false) => {
        const { 
            limit,
            index
         } = this.state;

        this.setState({ isLoading: true });
        GetPosts(index, limit, this.props.user || "", (success, res) => {
            if(success) {
                if(ignoreEmpty &&
                    res.data.length === 0)
                {
                    return this.onUpdateIndex(0, true);
                } else {
                    this.setState({ 
                        total: res.totalAmount || limit,
                        posts: res.data
                    });
                }
            } else {
                console.error(success, res);
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
            <div id="post-thumb-sm" key={idx} >
                <div id="post-thumb-info-sm" onClick={this.redirectToPost(post, false)}>
                    <div id="post-thumbnail-sm">
                        <img src={`${Config.baseUrl}${post.thumbnail}`} alt="Post Thumbnail" />
                    </div>
                    <div id="post-thumb-title-sm">{post.title}</div>
                </div>
                {!this.props.noUser &&
                    <div id="post-thumb-creator-sm" onClick={this.redirectToPost(post, true)}>
                        <div id="post-thumb-creator-img">
                            <Identicon 
                                size="30"
                                string={post.author.username}
                            />
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
                }
            </div>
        );
    }

    render() {
        const { 
            posts,
            limit,
            total,
            index,
            isLoading
        } = this.state;

        const {
            children,
            noRel
        } = this.props;

        if(posts.length < 1 && !isLoading)
            return (
                <>
                    {children}
                    <div id={noRel ? "no-posts-overlay-no-rel" : "no-posts-overlay"}>
                        <FontAwesomeIcon icon={faFolderOpen} />
                        No Posts Yet
                    </div>
                    {!noRel &&
                        <div id="no-posts-placeholder" />
                    }
                </>
            );

        return (
            <>
                {!isLoading && children}
                <div id="bg-inner-wrapper">
                    {isLoading && 
                        <div id="post-loading">
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                        </div>
                    }
                    {!isLoading && 
                        <div id="posts-wrapper">
                            {posts.map((d, i) => this.renderPost(d, i))}
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
  
export default Posts;