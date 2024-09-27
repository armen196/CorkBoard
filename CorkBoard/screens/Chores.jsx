import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';

import color from '../Colors';
import { getChores, getList, globalGroupID, makeChore, makeItem, makeList, print } from '../scripts';
import { SwipeListView } from 'react-native-swipe-list-view';
import { styles } from '../styles';

export default function Chores() {
    const [hasData, changeHasData] = useState(false);
    const [showPostBar, changeShowPostBar] = useState(false);
    const [choreToAdd, changeChoreToAdd] = useState('');
    const [choreDesc, changeChoreDesc] = useState('');
    const postBarHeight = useRef(new Animated.Value(0)).current;
    let chores = [];
    
    const togglePostBar = () => {
        Animated.timing(postBarHeight, {
            toValue: showPostBar ? 0 : 200,
            useNativeDriver: false,
        }).start();
        changeShowPostBar(!showPostBar);
    }

    const fetchChores = async => {
        getChores();
    }
    
    useEffect(() => {
        fetchChores();
    }, []);
    

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: color.primary }} >
            <View style={{ width: '100%', justifyContent: 'space-around'}}>
                <View style={[styles.boxVert, { paddingVertical: 40}]}>
                    <Text style={styles.title}>Chores</Text>
                    <Text style={styles.title}
                    onPress={() => {
                        togglePostBar();
                        print("asdf");
                    }}>+</Text>
                </View>
                <Animated.View style={{width: '100%', height: postBarHeight, justifyContent: 'space-around', alignItems: 'center'}}>
                    <TextInput value={choreToAdd} onChangeText={changeChoreToAdd} placeholder='Enter a chore' style={{width: '80%', borderBottomWidth: 1, borderColor: 'black'}}/>
                    <TextInput value={choreDesc} onChangeText={changeChoreDesc} placeholder='Enter a description' style={{width: '80%', borderBottomWidth: 1, borderColor: 'black'}}/>
                    <View style={styles.boxVert}>
                        <Text style={[styles.buttonText, {color: 'red'}]} onPress={togglePostBar}>CANCEL</Text>
                        <Text style={[styles.buttonText, {color: 'green'}]} onPress={async () => {
                            togglePostBar();
                            await makeChore(choreToAdd, choreDesc);
                        }}>SUBMIT</Text>
                    </View>
                </Animated.View>
            </View>

            <View style={{ width: '100%', height: 300, backgroundColor: 'black' }}>
                <FlatList
                    style={{}}
                    />
            </View>
        </View >
    );
}
