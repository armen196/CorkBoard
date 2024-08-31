import axios from 'axios';
import React from 'react';
import { Alert } from 'react-native';
import { codes, messages } from './codes';

/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns -1 for error, 0 for success, 1 for name taken
 */
export function registerUser(username, password) {
    const url = 'http://10.0.0.228:8000/CorkBoard/addUser/';
    const data = {
        username: username,
        password: password
    };

    return axios.post(url, data)
        .then(response => {
            console.log("wut");
            const data = response.data;
            if (data.code == codes.USERNAME_TAKEN) {
                console.log('Username taken');
                return 1;
            } else if (data.code == codes.USERNAME_AVAILABLE) {
                console.log('Username available, account created');
                return 0;
            }
        })
        .catch(error => {
            console.error('There was a problem with the PUT request:', error);
            return -1;
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
                console.log(messages.SUCCESSFUL_LOGIN);
                return 0;
            } else if (data.code == 502) {
                console.log(messages.ERROR_USER_DONT_EXIST);
                return 1;
            }
        })
        .catch(error => {
            console.error('There was a problem with the PUT request:', error);
            return -1;
        });
    
}