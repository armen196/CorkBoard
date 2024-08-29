import axios from 'axios';
import React from 'react';
import { Alert } from 'react-native';
import { codes } from './codes';

export function registerUser(username, password) {
    console.log("New User Clicked");
    const url = 'http://10.0.0.228:8000/CorkBoard/addUser/';
    console.log("Atempting to make " + username + " and " + password);
    const data = {
        username: username,
        password: password
    };
    return axios.post(url, data)
        .then(response => {
            const data = response.data;
            if (data.code == 503) {
                console.log("   Username already exists");
                return 1;
            }
        })
        .catch(error => {
            console.error('There was a problem with the PUT request:', error);
        });
}

/**
 * Used to handle sign in. If successful, return 1, if not, return 0, if an error, return -1
 * 
 * @param {*} username 
 * @param {*} password 
 */
export function signIn(username, password) {
    const url = 'http://10.0.0.228:8000/CorkBoard/signIn/';
    console.log("Atempting to sign in " + username + " with password " + password);
    const data = {
        username: username,
        password: password
    };
    return axios.post(url, data)
        .then(response => {  
            const data = response.data;
            console.log(data);
            if (data.code == 501) {
                console.log(codes.SUCCESSFUL_LOGIN);
                return 0;
            } else if (data.code == 502) {
                console.log(codes.ERROR_USER_DONT_EXIST);
                return 1;
            }
        })
        .catch(error => {
            console.error('There was a problem with the PUT request:', error);
            return -1;
        });
    
}