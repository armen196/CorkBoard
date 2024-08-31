import React, { useState } from 'react';
import { StatusBar, Dimensions } from 'expo-status-bar';
import { Animated, StyleSheet, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors';

var DATA = [
    { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
    // { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
];

var COMMENTS = [
    { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' },
    { postID: '1', username: 'Alex', reply: 'Agreed...' },
    { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' },
    { postID: '1', username: 'Alex', reply: 'Agreed...' },
    { postID: '1', username: 'Arman', reply: 'Thats a load of bulhonkey' },
    { postID: '1', username: 'Alex', reply: 'Agreed...' },
];

export default function HomeScreen() {
    const { height, width } = useWindowDimensions();
    const [data, setData] = useState(DATA);
    const newData = [...data];
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

    const handlePressIn = (scaleValue, isPressed) => {
        Animated.spring(scaleValue, {
            toValue: isPressed ? 100 : 300,
            useNativeDriver: false,
        }).start();
    };

    const renderPosts = ({ item }) => {
        return (
            <View style={[styles.itemBox, {height: 50, backgroundColor: 'rgba(0, 0, 0, 0)'}]}>
                <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                <Text>{item.reply}</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        // const [scaleValue] = useState(new Animated.Value(1));
        return (
            <Animated.View style={[itemBoxDynamic, {
                height: item.scaleValue
            }]}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                        handlePressIn(item.scaleValue, item.isPressed);
                        item.isPressed = !item.isPressed;
                        setData(newData);
                    }
                    } >
                    {item.isPressed ? (
                        <View style={{ width: '100%', height: '100%', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                            <Text>{item.post}</Text>
                            <FlatList style={{height: '70%', justifyContent: 'space-around'}} data={COMMENTS.slice(COMMENTS.length - 3)} renderItem={renderPosts} />
                            <Text style={{fontWeight: 'bold'}}>REPLY</Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                            <Text>{item.post}</Text>
                        </View>

                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    }



    return (
        <SafeAreaView style={styles.homeContainer}>
            <View style={{ height: '20%', justifyContent: 'space-around' }}>
                <Text style={styles.title}>Home</Text>
            </View>

            <View style={{ width: '100%', height: '80%' }}>
                <FlatList contentContainerStyle={styles.scrollView} data={DATA} renderItem={renderItem} />
            </View>


        </SafeAreaView >
    );
}