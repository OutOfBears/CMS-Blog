import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

class Portal extends React.Component {
    state = {
        posts: [
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
            {
                user: {name: "Jack Fox", pic: "https://t2.ea.ltmcdn.com/en/images/7/8/1/what_colors_are_shiba_inu_dogs_187_600.jpg"}, 
                title: "Revisiting the Reality TV Shows of My Youth",
                post: "‘Queer Eye’ and ‘American Idol’ have evolved alongside American culture — and maybe I have, too",
                thumb: "https://www.nbcsports.com/sites/nbcsports.com/files/2018/11/21/nbc_dog_nonsporting_shibainu_181119.jpg",
                date: new Date()
            },
        ]
    }
    
    formatDate = (date) => {
        return date.toDateString();
    }

    renderPost = (post, idx) => {
        return (
            <div id="post-thumb" key={idx}>
                <div id="post-thumbnail">
                    <img src={post.thumb} alt="Post Thumbnail" />
                </div>
                <div id="post-thumb-title">{post.title}</div>
                <div id="post-thumb-desc">{post.post}</div>
                <div id="post-thumb-creator">
                    <div id="post-thumb-creator-img">
                        <img src={post.user.pic} alt="User profile" />
                    </div>
                    <div id="post-thumb-creator-info">
                        <Link to={`/users/${post.user.name}`}>
                            {post.user.name}
                        </Link>
                        <span id="post-thumb-create-date">
                            {this.formatDate(post.date)}
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
            <div id="posts-wrapper">
                {posts.map((d, i) => this.renderPost(d, i))}
            </div>
        );
    }
}
  
export default Portal;