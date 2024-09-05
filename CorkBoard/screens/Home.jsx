import React, { useEffect, useState } from 'react';
import { StatusBar, Dimensions } from 'expo-status-bar';
import { Animated, StyleSheet, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, Touchable, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors';
//import { posts } from '../screens/Login';
import { getPosts } from '../scripts';
import { groupID } from '../globals';

// var DATA = [
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
//     { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
// ];

// var COMMENTS = [
//     { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' },
//     { postID: '1', username: 'Alex', reply: 'Agreed...' },
//     { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' },
//     { postID: '1', username: 'Alex', reply: 'Agreed...' },
//     { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' },
//     { postID: '1', username: 'Alex', reply: 'Agreed...' },
// ];
let posts = [];
let comments = [
    { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' }
];
let animVals = [];
let showVals = [];
export default function HomeScreen() {
    const { height, width } = useWindowDimensions();
    const [hasData, changeHasData] = React.useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await getPosts();
                result.posts.forEach(post => {
                    // var stringToAdd = JSON.stringify(post).slice(0, JSON.stringify(post).length - 1).concat(", \"scaleValue\": \"new Animated.Value(100)\", \"isPressed\": \"false\"}");
                    posts.push(post);
                    animVals.push(new Animated.Value(100));
                    showVals.push(false);
                    
                });
                //var stringToAdd = JSON.stringify(result).slice(0, JSON.stringify(result).length - 1).concat(", \"scaleValue\": \"new Animated.Value(100)\", \"isPressed\": \"false\"}");
                changeHasData(true);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    if (!hasData) {
        return (
            <View style={{ alignItems: 'center', backgroundColor: 'black', width: '100%', height: '100%' }}>
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
        padding: 7
    };

    const handlePressIn = (scaleValue, isPressed, numberOfItems) => {
        Animated.spring(scaleValue, {
            toValue: isPressed ? 100 : (numberOfItems * 50) + 150,
            useNativeDriver: false,
        }).start();
    };

    const renderPosts = ({ item }) => {
        return (
            <View style={[styles.itemBox, { height: 50, backgroundColor: 'rgba(0, 0, 0, 0)', paddingStart: '10%' }]}>
                <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                <Text>{item.reply}</Text>
            </View>
        );
    }
    
    const renderItem = ({ item }) => {
        // const [scaleValue] = useState(new Animated.Value(1));
        
        const ind = posts.indexOf(item);
        return (
            <Animated.View style={[itemBoxDynamic, {
                height: animVals[ind],
            }]}>
                <TouchableOpacity
                    style={{ justifyContent: 'space-around', width: '100%', alignItems: 'center'}}
                    onPress={() => {

                        //posts.indexOf(item)
                        // handlePressIn(item.scaleValue, item.isPressed, COMMENTS.length);
                        // item.isPressed = !item.isPressed;
                        handlePressIn(animVals[ind], showVals[ind], comments.length);
                        showVals[ind] = !showVals[ind]
                        console.log("Handle press in initiated");
                        setData(newData);
                    }
                    }>
                    {showVals[ind] ? (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'space-around' }}>
                            <View style={[styles.itemBox, { height: 100, backgroundColor: 'rgba(0, 0, 0, 0)' }]}>
                                <Text style={{ fontWeight: 'bold' }}>{item.poster}</Text>
                                <Text>{item.post}</Text>
                            </View>
                            {/* <FlatList style={{ justifyContent: 'space-around' }} data={COMMENTS} renderItem={renderPosts} /> */}
                            <TouchableOpacity
                                style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}
                                onPress={console.log('asfd')}>
                                <Text style={{ fontWeight: 'bold' }}>REPLY</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>{item.poster}</Text>
                            <Text>{item.post}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    }



    return (
        <SafeAreaView style={styles.homeContainer}>
            <View style={{ height: '20%', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.title}>Home</Text>
                <Text style={styles.title}>+</Text>
            </View>

            <View style={{ width: '100%', height: '80%' }}>
                <FlatList contentContainerStyle={styles.scrollView} data={posts} renderItem={renderItem} />
            </View>


        </SafeAreaView >
    );
}