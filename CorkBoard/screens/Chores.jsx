import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Image } from 'react-native';

import color from '../Colors';
import { getChores, getList, globalGroupID, makeChore, makeItem, makeList, print } from '../scripts';
import { SwipeListView } from 'react-native-swipe-list-view';
import { styles } from '../styles';

let chores = [];
export default function Chores() {
    const [hasData, changeHasData] = useState(false);
    const [showPostBar, changeShowPostBar] = useState(false);
    const [choreToAdd, changeChoreToAdd] = useState('');
    const [choreDesc, changeChoreDesc] = useState('');
    const postBarHeight = useRef(new Animated.Value(0)).current;
    const screenWidth = Dimensions.get('window').width;

    const togglePostBar = () => {
        Animated.timing(postBarHeight, {
            toValue: showPostBar ? 0 : 200,
            useNativeDriver: false,
        }).start();
        changeShowPostBar(!showPostBar);
    }

    const fetchChores = async () => {
        const data = await getChores();
        chores = data;
        changeHasData(true);
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
                    <ScrollView style={{ width: '100%', padding: 20 }} contentContainerStyle={{flex: 1}}>
                        <Text>{item.description}</Text>
                    </ScrollView>
                    <View style={{height: '20%'}}></View>
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
                        }}>SUBMIT</Text>
                    </View>
                </Animated.View>
            </View>

            {hasData ? (
                <FlatList
                    style={{ flex: 1 }}
                    data={chores}
                    renderItem={choreItem}
                    horizontal={false}
                    numColumns={2}
                    columnWrapperStyle={{ alignItems: 'center', justifyContent: 'space-around' }}
                    contentContainerStyle={{ rowGap: 20 }}
                />
            ) : (
                <Text>Loading...</Text>
            )}

        </View >
    );
}
