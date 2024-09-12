import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../styles';
import color from '../Colors';
import { getPostReplies, getPosts, makePost, globalGroupID, makeReply, globalFirstName } from '../scripts';

let posts = [];
let comments = [];
let animVals = [];
let showVals = [];
export default function HomeScreen() {
    const { height, width } = useWindowDimensions();
    const [hasData, changeHasData] = React.useState(false);
    const [data, setData] = useState([]);
    const [beenLoaded, setBeenLoaded] = useState(false);
    const [postBar, showPostBar] = useState(false);
    const animHeight = useRef(new Animated.Value(0)).current;
    const contHeight = useRef(new Animated.Value(height * .2)).current;
    const [showReply, changeShowReply] = React.useState(false);
    const [toPost, changeToPost] = useState('');
    const [toReply, changeToReply] = useState('');
    const [isFetching, changeIsFetching] = useState(false);
    const fetchPosts = async () => {
        changeIsFetching(true);
        try {
            posts = [];
            const result = await getPosts(globalGroupID);
            result.posts.forEach(async (post) => {
                posts.push(post);
                animVals.push(new Animated.Value(100));
                showVals.push(false);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        changeIsFetching(false);
    };

    useEffect(() => {
        fetchPosts();
        changeHasData(true);
    }, []);

    if (!hasData) {
        return (
            <View style={{ alignItems: 'center', width: '100%', height: '100%' }}>
                <ActivityIndicator size="large" color={color.black} />
            </View>

        );
    }

    const newData = [...posts];
    const itemBoxDynamic = {
        backgroundColor: color.white,
        borderRadius: 15,
        height: 100,
        width: width * .9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 7
    };

    const REPLY_BOX_SIZE = 75;

    const handlePressIn = (scaleValue, isPressed, numberOfItems) => {
        Animated.spring(scaleValue, {
            toValue: isPressed ? 100 : (numberOfItems * 75) + 150,
            useNativeDriver: false,
        }).start();
    };

    const renderPosts = ({ item }) => {
        return (
            <View style={[styles.itemBox, { height: REPLY_BOX_SIZE, backgroundColor: 'rgba(0, 0, 0, 0)' }]}>
                <Text style={{ fontWeight: 'bold' }}>{item.poster}</Text>
                <Text>{item.post}</Text>
            </View>
        );
    };

    const updateReplies = (async (ind, postID, update) => {
        comments = [];
        if (!showVals[ind] || update) {
            const result = await getPostReplies(postID);
            result.comments.forEach(post => {
                comments.push(post);
            })
        } else {
            
        }
        if (!update) {
            let x = showVals.length;
            for (let i = 0; i < x; i++) {
                if (i != ind) showVals[i] = false;
                handlePressIn(animVals[i], true, (comments.length));
            }
            handlePressIn(animVals[ind], showVals[ind], (comments.length));
            showVals[ind] = !showVals[ind]
        } else {
            handlePressIn(animVals[ind], false, (comments.length));
        }
        setData(newData);
    });



    const renderItem = ({ item }) => {
        const ind = posts.indexOf(item);

        var replyHeight = 50;
        return (
            <Animated.View style={[itemBoxDynamic, {
                height: animVals[ind],
            }]}>
                <TouchableOpacity
                    style={{ justifyContent: 'space-around', width: '100%', alignItems: 'center' }}
                    onPress={async () => {
                        updateReplies(ind, item.postID, false);
                    }
                    }>
                    {showVals[ind] ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View style={[styles.itemBox, { height: 100, backgroundColor: 'rgba(0, 0, 0, 0)', textAlign: 'center' }]}>
                                <Text style={{ fontWeight: 'bold' }}>{item.poster}</Text>
                                <Text>{item.post}</Text>
                            </View>
                            <FlatList style={{ width: '100%', justifyContent: 'space-around', alignItems: 'center' }} data={comments} renderItem={renderPosts} />

                            <View
                                style={{ height: replyHeight, alignItems: 'center', justifyContent: 'center', width: '100%' }}
                                onPress={console.log('asdfasdfasdf')}>

                                <TextInput onPress={() => changeShowReply(true)} style={{}} placeholder='REPLY' onChangeText={changeToReply} value={toReply} />
                                {showReply ? (
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }} onPress={() => {
                                            changeShowReply(false);
                                        }
                                        }>CANCEL</Text>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }} onPress={async () => {
                                            makeReply(toReply, item.postID);
                                            changeShowReply(false);
                                            updateReplies(ind, item.postID, true);
                                            changeToReply('');

                                        }
                                        }>REPLY</Text>
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                            </View>

                        </View>
                    ) : (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View style={[styles.itemBox, { height: 100, backgroundColor: 'rgba(0, 0, 0, 0)', textAlign: 'center' }]}>
                                <Text style={{ fontWeight: 'bold' }}>{item.poster}</Text>
                                <Text>{item.post}</Text>
                            </View>

                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    const togglePostBar = () => {
        Animated.timing(animHeight, {
            toValue: postBar ? 0 : 100,
            useNativeDriver: false
        }).start();
        showPostBar(!postBar);
        changeToPost('');
    };

    const toggleHeight = () => {
        Animated.timing(animHeight, {
            toValue: (postBar) ? height * .2 : height * .3,
            useNativeDriver: false
        }).start();
        showPostBar(!postBar);
    };

    return (
        <SafeAreaView style={[styles.homeContainer]}>
            <View style={{ width: '100%', height: contHeight, alignItems: 'center', justifyContent: 'space-around' }}>
                <View style={{ paddingTop: 40, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Text style={styles.title}>{"Welcome, \n" + globalFirstName}</Text>
                    <Animated.View>
                        <TouchableOpacity onPress={() => {
                            togglePostBar();
                        }}>
                            <Text style={[styles.title]}>+</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Animated.View style={{ width: '100%', height: animHeight, alignItems: 'center', justifyContent: 'space-around', overflow: 'hidden'}}>
                    <TextInput style={{ backgroundColor: color.secondary, width: 300, height: '40%', paddingStart: 15, borderRadius: 15 }} onChangeText={changeToPost} value={toPost} placeholder='Enter post here' />
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Button
                            title="cancel"
                            color={color.red}
                            onPress={() => {
                                togglePostBar();
                            }
                            } />
                        <Button
                            title="post"
                            color={color.green}
                            onPress={() => {
                                makePost(toPost);
                                fetchPosts();
                                togglePostBar();
                            }} />
                    </View>

                </Animated.View>
            </View>


            {/* {postBar ? (
                <Animated.View style={{ width: '100%', height: '20%', alignItems: 'center', backgroundColor: 'black' }}>
                    <TextInput style={{ backgroundColor: color.secondary, width: 100 }}></TextInput>
                </Animated.View>
            ) : ( <></> )} */}




            <View style={{ paddingTop: 25, width: '100%' }}>
                <FlatList
                    contentContainerStyle={styles.scrollView}
                    data={posts}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={getPosts} />
                    } />
            </View>


        </SafeAreaView >
    );
}