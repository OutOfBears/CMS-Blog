import { Exception } from "handlebars";

// https://localhost:44356/

export const Config = {
    baseUrl: process.env.NODE_ENV === 'development' ?
        'https://localhost:44356' : ''
}

const NullFunction = () => { }

export async function GetPost(id, callback = NullFunction)
{
    fetch(`${Config.baseUrl}/api/posts/${id}`)
        .then(res => res.json())
        .then(res => callback(true, res))
        .catch(ex => callback(false, ex))
}

export async function GetPopularPosts(limit = 10, callback = NullFunction)
{
    fetch(`${Config.baseUrl}/api/posts/popular?limit=${limit}`)
        .then(res => res.json())
        .then(res => callback(true, res))
        .catch(ex => callback(false, ex))
}

export async function DeletePost(id, callback = NullFunction) {
    fetch(`${Config.baseUrl}/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(res => {
            if(res.ok)
                return callback(true);
            return callback(false, "failed");
        })
        .catch(ex => callback(false, ex));
}

// THUMBNAIL HAS TO EQUAL A FILE!
export async function SubmitPost(title, content, thumbnail, callback = NullFunction)
{
    var formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('thumbnail', thumbnail);

    fetch(`${Config.baseUrl}/api/posts`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
        .then(res => res.json())
        .then(data => callback(true, data))
        .catch(ex => callback(false, ex));
}

export async function DownloadUser(callback = NullFunction)
{
    fetch(`${Config.baseUrl}/api/auth/me`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(res => callback(true, res))
        .catch(ex => callback(false, ex));
}

export async function LogoutAsync(callback = NullFunction) {
    fetch(`${Config.baseUrl}/api/auth/Logout`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => {
            if(res.ok)
                return callback(true);

            return callback(false, "Unauthorized");
        })
        .catch(err => {
            callback(false, err);
        })
}

export async function LoginAsync(user, password, callback = NullFunction)
{
    fetch(`${Config.baseUrl}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ user, password }),
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if(!res.ok)
                return res.text();
            return res.json();
        })
        .then(res => { 
            if(typeof res === 'object') 
                return callback(true, res);
            else if(typeof res === 'string')
                throw new Exception(res);
            else
                throw new Exception("invalid server response")
        })
        .catch(err => {
            let message = err;
            if(typeof err === 'object')
                message = err.message;

            switch(message){
                case "Failed to fetch":
                    message = "failed to contact server";
                    break;

                default:
                    break;
            }

            callback(false, message);
        })
}

export async function RegisterAsync(username, email, password, callback = NullFunction)
{
    fetch(`${Config.baseUrl}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if(!res.ok)
                return res.text();
            return res.json();
        })
        .then(res => { 
            if(typeof res === 'object') 
                return callback(true, res);
            else if(typeof res === 'string')
                throw new Exception(res);
            else
                throw new Exception("invalid server response")
        })
        .catch(err => {
            let message = err;
            if(typeof err === 'object')
                message = err.message;

            switch(message){
                case "Failed to fetch":
                    message = "failed to contact server";
                    break;

                default:
                    break;
            }

            callback(false, message);
        })
}