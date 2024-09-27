import axios from 'axios';
import React from 'react';
import { Alert } from 'react-native';
import { codes, messages } from './codes';
import {  } from './globals';
//import { groupID, groupIDGlobal, userNameGlobal } from './globals'

export var globalGroupID = '';
export var globalUserName = '';
export var globalFirstName = '';
export var groupMembers = [];

export async function registerUser(userName, password, firstName, lastName, groupID, imageUri) {
    const url = 'http://10.0.0.228:8001/CorkBoard/addUser/';
    // Create FormData and append all fields, including the image
    let formData = new FormData();
    formData.append('username', userName);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('groupID', groupID);
    formData.append('image', {
        uri: imageUri,       // URI to the image
        name: userName + '.jpg',   // Name of the file
        type: 'image/jpeg'   // MIME type
    });

    try {
        // Send formData directly
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Important to set this header for FormData
            },
        });
        
        const data = response.data;
        if (data.code === 511) {
            console.log('Username taken');
            return 1;
        } else if (data.code === 510) {
            console.log('Username available, account created');
            return 0;
        } else {
            return 'hmm';
        }
    } catch (error) {
        console.error('There was a problem with the POST request:', error);
        return -1;
    }
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
                updateUsers(globalGroupID);
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

export function print(toPrint) {
    console.log(toPrint);
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

export async function makeItem(listID, item) {
    const url = 'http://10.0.0.228:8001/CorkBoard/makeItem/';
    const toSend = {
        listID: listID,
        item: item
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return 0;
        }
        )
}

export async function getItems(listID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/getItems/';
    const toSend = {
        listID: listID
    }
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return data;
        }
        )
}

export async function removeItem(id) {
    const url = 'http://10.0.0.228:8001/CorkBoard/removeItem/';
    const toSend = {
        id: id
    }

    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return data;
        }
        )
}

export async function markItemAsPurchased(id) {
    const url = 'http://10.0.0.228:8001/CorkBoard/markAsPurchased/';
    const toSend = {
        id: id
    }

    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return data;
        }
        )
}

export async function changeListName(listName, existingListName) {
    const url = 'http://10.0.0.228:8001/CorkBoard/changeName/';
    const toSend = {
        toChange: existingListName,
        listName: listName
    }

    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return data;
        }
        )
}

export async function deleteList(listName) {
    const url = 'http://10.0.0.228:8001/CorkBoard/deleteList/';
    const toSend = {
        listName: listName
    }

    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            return data;
        }
        )
}

export async function getGroupMembers(groupID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/getGroupMembers/';
    const toSend = {
        groupID: groupID
    }

    return await axios.post(url, toSend)
        .then(response => {

            const data = response.data;

            return data;
        }
        )

}

export async function updateUsers(groupID) {
    const url = 'http://10.0.0.228:8001/CorkBoard/getUsers/';
    const toSend = {
        groupID: groupID
    }

    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            if (data == 521) {
                return 1;
            } else {
                groupMembers = data;
                return data;
            }
            
        }
        )
}

export function getImageTag(userName) {
    groupMembers.forEach(element => {
        console.log("Checking " + JSON.stringify(element) + " against " + userName);
        if (element.username == userName) {
            console.log("returning: " + 'http://10.0.0.228:8001/media/' + element.image);
            return 'http://10.0.0.228:8001/media/' + element.image;
        }
        console.log("Got no image tag");
    });
}

export async function getChores() {
    const url = 'http://10.0.0.228:8001/CorkBoard/getChores/';
    const toSend = {
        groupID: globalGroupID
    }

    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            if (data == 531) {
                return 1;
            } else {
                print(data);
                return data;
            }
            
        }
        )
}

/**
 * 
 * @param {*} chore Name of chore to add
 * @param {*} description Optional description for chore
 * @returns 
 */
export async function makeChore(chore, description) {
    const url = 'http://10.0.0.228:8001/CorkBoard/addChore/';
    const toSend = {
        groupID: globalGroupID,
        chore: chore,
        description: description,
        userName: globalUserName
    }
    print("Username: " + globalUserName + ", groupID: " + globalGroupID);
    return await axios.post(url, toSend)
        .then(response => {
            const data = response.data;
            if (data == 531) {
                return 1;
            } else {
                print(data);
                return data;
            }
            
        }
        )
}