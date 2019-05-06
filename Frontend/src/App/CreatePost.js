import React from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import { SubmitPost } from '../api';

import ReactMarkdown from 'react-markdown';

class CreatePost extends React.Component {
    state = {
        title: '',
        content: '',
        thumbnail: '',
        viewPost: false,

        error: ''
    }
    
    handleChange = (name, limit = -1) => (e) => {
        if(limit > 0 && e.target.value.length > limit)
            return;

        this.setState({ [name]: e.target.value });
    }

    changeView = () => {
        const { viewPost, title, content } = this.state;
        if(title.trim() !== '' && content.trim() !== '')
            this.setState({ viewPost: !viewPost });
    }

    formResponse = (success, data) => {
        if(success) {
            this.props.history.push(`/posts/${data._id}`);
        } else {
            this.setState({
                error: 'failed to create post'
            })
        }
    }

    onSubmit = (context) => (e) => {
        const { title, content } = this.state;

        e.preventDefault();

        if(title.trim() === ''
            || content.trim() === ''
            || this.thumb.files.length < 1)
            return;

        SubmitPost(title, content, this.thumb.files[0],
            this.formResponse);
    }

    onTextKeyUp = (e) => {
        var node = ReactDOM.findDOMNode(this.textRef);
        node.style.height = (node.scrollHeight-10)+'px';
    }


    render() {
        const { 
            error,
            title, 
            content,
            thumbnail,
            viewPost
        } = this.state;

        return (
            <div id="bg-inner-wrapper">
                <div id="post-create">
                    {error !== '' &&
                        <div id="auth-error">
                            Error: {error}
                        </div>
                    }
                    <h3 id="post-title">
                        {viewPost && <>{title}</>}
                        {!viewPost && <>Create Post</>}
                    </h3>
                    <UserContext.Consumer>
                        {(context) => (
                            <form onSubmit={this.onSubmit(context)}>
                                <div style={{display: viewPost === true ? 'none' : 'initial'}}>
                                    <label>
                                        Post Title
                                        <input type="text" name="user" autoFocus required
                                            value={title} onChange={this.handleChange("title", 50)} />
                                    </label>
                                    <label>
                                        Post Thumbnail
                                        <input type="file" name="thumb" required 
                                            value={thumbnail} onChange={this.handleChange("thumbnail")} 
                                            accept="image/*"   
                                            ref={ref => this.thumb = ref} 
                                        />
                                    </label>
                                    <label>
                                        <div>
                                            <span>Post Content</span>
                                            <span>
                                                <>Please Note: We accept </>
                                                <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" rel="noopener noreferrer">
                                                    markdown
                                                </a>
                                            </span>
                                        </div>
                                        <textarea name="text" required rows="4" cols="50"
                                            ref={ref => this.textRef = ref} onKeyUp={this.onTextKeyUp}
                                            value={content} onChange={this.handleChange("content")} />
                                    </label>
                                </div>
                                {viewPost && 
                                    <div id="post-content">
                                        <ReactMarkdown 
                                            source={content}
                                            linkTarget={"_blank"}
                                            escapeHtml
                                        />
                                    </div>
                                }
                                <div id="post-create-buttons">
                                    <button id="post-create-preview-button" onClick={this.changeView}>
                                        Preview Post
                                    </button>
                                    <input type="submit" id="post-create-submit-button" value="Create Post" />
                                </div>
                                {!context.isLoggedIn() && <Redirect to="/" />}
                            </form>
                        )}
                    </UserContext.Consumer>
                </div>
            </div>
        );
    }
}
  
export default CreatePost;