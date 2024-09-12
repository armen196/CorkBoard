import axios from 'axios';
import React from 'react';
import { Alert } from 'react-native';
import { codes, messages } from './codes';
//import { groupID, groupIDGlobal, userNameGlobal } from './globals'

export var globalGroupID = '';
export var globalUserName = '';
export var globalFirstName = '';

/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns -1 for error, 0 for success, 1 for name taken
 */
export function registerUser(username, password, firstName, lastName, groupID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/addUser/';
    const data = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        groupID: groupID
    };

    return axios.post(url, data)
        .then(response => {
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
    const url = 'http://10.0.0.228:8001/CorkBoard/signIn/';
    console.log("Atempting to sign in " + username + " with password " + password);
    const data = {
        username: username,
        password: password
    };
    return axios.post(url, data)
        .then(response => {
            const data = response.data;
            if (data.code == 501) {
                console.log(messages.SUCCESSFUL_LOGIN);
                globalGroupID = data.groupID;
                globalUserName = username;
                globalFirstName = data.firstName;
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

export function print (varName="Default", toPrint) {
    console.log(varName + ": " + toPrint);
}

export async function getPosts(groupID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/getPosts/';
    const data = {
        groupID: groupID
    };
    return await axios.post(url, data)
        .then(response => {
            const toReturn = response.data;
            if (toReturn) {
                //console.log(messages.ERROR_POST_DOES_NOT_EXIST);
                return toReturn;
            } else if (data.code == 504) {
                console.log("Could not get posts");
                return 1
            }
        })
}

export async function getPostReplies(postID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/getPostsReplies/';
    const data = {
        postID: postID
    };
    return await axios.post(url, data)
        .then(response => {
            const toReturn = response.data;
            if (toReturn) {

                return toReturn;
            } else {
                //console.log("Post with id \"" + postID + "\" did not have any replies...");
                return null;
            }
        }
        )
}

export async function makeReply(reply, postID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/makeReply/';

    const toSend = {
        postID: postID,
        replier: globalUserName,
        post: reply
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
        }
        )
}

export async function makePost(post) {
    const url = 'http://10.0.0.228:8001/CorkBoard/makePost/';

    const toSend = {
        groupID: globalGroupID,
        poster: globalUserName,
        post: post
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
        }
        )
}

export async function makeList(listName) {
    const url = 'http://10.0.0.228:8001/CorkBoard/makeList/';
    const toSend = {
        listName: listName,
        groupID: globalGroupID
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            
        }
        )
}

export async function getList() {
    const url = 'http://10.0.0.228:8001/CorkBoard/getList/';
    const toSend = {
        groupID: globalGroupID
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return data;
        }
        )
}

export async function makeItem(itemName) {
    const url = 'http://10.0.0.228:8001/CorkBoard/makeList/';
    const toSend = {
        listName: listName,
        groupID: globalGroupID
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            
        }
        )
}