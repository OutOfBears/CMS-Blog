// https://localhost:44356/

const Config = {
    baseUrl: 'https://localhost:44356'
}

const NullFunction = () => { }

export function GetCookie(cookieName)
{
    var name = `${cookieName}=`;
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while(cookie.charAt(0) === ' ') 
            cookie = cookie.substring(1);
        
        if(cookie.indexOf(name) === 0)
            return cookie.substring(name.length, 
                cookie.length);
    }

    return "";
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
            callback(true, res);
        })
        .then(res => { if(typeof res === 'string') throw res })
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
            callback(true, res);
        })
        .then(res => { if(typeof res === 'string') throw res })
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