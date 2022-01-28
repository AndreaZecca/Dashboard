const jwt = require('jsonwebtoken')
const deploy = true
const BASE_URL = deploy ? 'https://site202129.tw.cs.unibo.it/api/auth' : 'http://localhost:8000/api/auth/'
const PUBLICKEY_URL = BASE_URL + '/publicKey'
const ACCESS_TOKEN_STORAGE = 'token'
const PUBLIC_KEY_STORAGE = 'publickey'

export function setLocalToken(token){
    localStorage[ACCESS_TOKEN_STORAGE] = token
}

export function setSessionToken(token){
    sessionStorage[ACCESS_TOKEN_STORAGE] = token
}

export function getLocalToken(){
    return localStorage[ACCESS_TOKEN_STORAGE]
}

export function getSessionToken(){
    return sessionStorage[ACCESS_TOKEN_STORAGE]
}

function getToken(){
    return getLocalToken() || getSessionToken()
}

async function getPublicKey(){
    if(!localStorage[PUBLIC_KEY_STORAGE] || localStorage[PUBLIC_KEY_STORAGE] === null || localStorage[PUBLIC_KEY_STORAGE] === undefined){
        try {
            console.log("Getting publicKey")
            let res = await fetch(PUBLICKEY_URL, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Access-Control-Allow-Origin': '*' }
            })
            let status = res.status
            res = await res.json()
            if(status === 200){
                localStorage[PUBLIC_KEY_STORAGE] = res.publicKey
            }
        } catch(e){
            console.log(e)
        }
    }
    return localStorage[PUBLIC_KEY_STORAGE]
}

export async function isLogged(){
    try{
        let decoded = await jwt.verify(getToken(), await getPublicKey(), {algorithms: 'RS256'})
        if (decoded.auth === 'admin' || decoded.auth === 4)
            return true
        else
            return false
    }
    catch(e){
        return false
    }
}

export async function getPersonalId(){
    try{
        let decoded = await jwt.verify(getToken(), await getPublicKey(), {algorithms: 'RS256'})
        return decoded.id
    }
    catch(e){
        return null
    }
}