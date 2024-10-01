import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Image } from 'react-native';

import color from '../Colors';
import { getChores, getList, getUsernameFromID, globalGroupID, makeChore, makeItem, makeList, markChoreAsCompleted, print } from '../scripts';
import { SwipeListView } from 'react-native-swipe-list-view';
import { styles } from '../styles';

let chores = [];
export default function Chores() {
    const [hasData, changeHasData] = useState(false);
    const [showPostBar, changeShowPostBar] = useState(false);
    const [choreToAdd, changeChoreToAdd] = useState('');
    const [choreDesc, changeChoreDesc] = useState('');
    const [noChores, changeNoChores] = useState(false)
    const postBarHeight = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;
    const [showCompleted, changeShowCompleted] = useState(false);

    const togglePostBar = () => {
        Animated.timing(postBarHeight, {
            toValue: showPostBar ? 0 : 200,
            useNativeDriver: false,
        }).start();
        changeShowPostBar(!showPostBar);
    }

    const fetchChores = async () => {
        chores = [];
        changeHasData(false);
        const data = await getChores();
        if (data == 'No chores') {
            changeNoChores(true);
        } else {
            changeNoChores(false);
            chores = data;
            changeHasData(true);
        }

    }

    useEffect(() => {
        fetchChores();

    }, []);

    const choreItem = ({ item, index }) => {
        print(item);
        return (
            <View>
                <View style={{ width: (screenWidth / 2) - 20, height: 300, backgroundColor: 'white', borderRadius: 15 }}>
                    <View style={{ width: '100%', height: '20%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.boxVert}>
                            <Image source={{ uri: 'http://10.0.0.228:8001/CorkBoard/getImageFromID/' + item.poster_id }} style={{ width: '20%', aspectRatio: 1, backgroundColor: 'black', borderRadius: 100 }} />
                            <Text style={{ fontWeight: '600' }}>{item.chore}</Text>
                        </View>
                    </View>
                    <ScrollView style={{ width: '100%', padding: 20 }} >
                        <Text>{item.description}</Text>
                    </ScrollView>
                    <View style={{ height: '20%', width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingVertical: 10, rowGap: 10 }}>
                        <View style={[styles.boxVert, { width: '100%' }]}>
                            <TouchableOpacity style={{ width: 40, borderWidth: 1, height: 40, borderRadius: 8 }} onPress={async () => {
                                await markChoreAsCompleted(item.id);
                                fetchChores();
                            }}>
                                <View style={styles.centerBox}>
                                    {item.completed ? (
                                        <Text style={{ fontSize: 30, color: 'green' }}>{'\u2713'}</Text>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            </TouchableOpacity>
                            {item.completed ? (<Text>Completed by</Text>) : (<Text>Complete</Text>)}

                        </View>
                        {item.completed ? (
                            <View style={styles.boxVert}>
                                <Image source={{ uri: 'http://10.0.0.228:8001/CorkBoard/getImageFromID/' + item.completer_id }} style={{ width: '20%', aspectRatio: 1, backgroundColor: 'black', borderRadius: 100 }} />
                                <Text></Text>
                            </View>
                            
                        ) : (<></>)}

                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: color.primary }} >
            <View style={{ width: '100%', justifyContent: 'space-around' }}>
                <View style={[styles.boxVert, { paddingVertical: 40 }]}>
                    <Text style={styles.title}>Chores</Text>
                    <Text style={styles.title}
                        onPress={() => {
                            togglePostBar();
                            print("asdf");
                        }}>+</Text>
                </View>
                <Animated.View style={{ width: '100%', height: postBarHeight, justifyContent: 'space-around', alignItems: 'center', overflow: 'hidden' }}>
                    <TextInput value={choreToAdd} onChangeText={changeChoreToAdd} placeholder='Enter a chore' style={{ width: '80%', borderBottomWidth: 1, borderColor: 'black' }} />
                    <TextInput value={choreDesc} onChangeText={changeChoreDesc} placeholder='Enter a description' style={{ width: '80%', borderBottomWidth: 1, borderColor: 'black' }} />
                    <View style={styles.boxVert}>
                        <Text style={[styles.buttonText, { color: 'red' }]} onPress={togglePostBar}>CANCEL</Text>
                        <Text style={[styles.buttonText, { color: 'green' }]} onPress={async () => {
                            togglePostBar();
                            await makeChore(choreToAdd, choreDesc);
                            fetchChores();
                        }}>SUBMIT</Text>
                    </View>
                    <View style={[styles.boxVert, { width: '60%' }]}>
                        <TouchableOpacity style={{ width: 40, borderWidth: 1, height: 40, borderRadius: 8 }} onPress={() => { changeShowCompleted(!showCompleted) }}>
                            <View style={styles.centerBox}>
                                {showCompleted ? (
                                    <Text style={{ fontSize: 30, color: 'green' }}>{'\u2713'}</Text>
                                ) : (
                                    <></>
                                )}
                            </View>

                        </TouchableOpacity>
                        <Text>Show completed?</Text>
                    </View>
                </Animated.View>
            </View>

            {hasData ? (
                <FlatList
                    style={{ flex: 1 }}
                    data={showCompleted ? chores : chores.filter(chore => chore.completed === false)}
                    renderItem={choreItem}
                    horizontal={false}
                    numColumns={2}
                    columnWrapperStyle={{ alignItems: 'center', justifyContent: 'space-around' }}
                    contentContainerStyle={{ rowGap: 20 }}
                />
            ) : (
                <View style={{ padding: 20 }}>
                    <View style={[styles.centerBox, { height: 200, backgroundColor: 'white', borderRadius: 15 }]}>
                        {noChores ? (
                            <View style={{ height: '100%', justifyContent: 'space-evenly' }}>
                                <Text style={[styles.buttonText, { fontSize: 20 }]}>There are currently no chores!</Text>
                                <Text>Click the plus button at the top right, and add a title and a description!</Text>
                            </View>

                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </View>
                </View>

            )}

        </View >
    );
}
