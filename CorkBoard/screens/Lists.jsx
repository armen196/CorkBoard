import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../styles';
import color from '../Colors';
import { changeListName, getList, makeItem, makeList, markItemAsPurchased, print, removeItem, deleteList } from '../scripts';
import { SwipeListView } from 'react-native-swipe-list-view';
import MasonryList from 'react-native-masonry-list';
import Bills from './Bills';
//let list = [];
const listAnimValues = [];
const itemList = [];
export default function Lists({ navigation }) {

    const [showAddList, changeShowAddList] = useState(false);
    const [listToAdd, changeListToAdd] = useState(false);
    const [hasData, changeHasData] = useState(false);
    const [editPost, changeEditPost] = useState(false);
    const [list, changeList] = useState([]);
    const [itemToAdd, changeItemToAdd] = useState('');
    const [nameToChange, changeNameToChange] = useState('');
    const [showItemEntry, changeShowItemEntry] = useState(false);
    const [isFetching, changeIsFetching] = useState(false);
    const addListHeight = useRef(new Animated.Value(0)).current;
    const addItemHeight = useRef(new Animated.Value(0)).current;
    const swipeSize = 70;
    const listItemHeight = 50;

    const [listData, setListData] = useState(
        Array(5)
            .fill('')
            .map((_, i) => ({ key: `${i}`, text: `Item ${i + 1}` }))
    );

    const handleAddPostClick = async () => {
        changeShowAddList(!showAddList);
        togglePostBar();
    }

    const togglePostBar = () => {
        Animated.timing(addListHeight, {
            toValue: showAddList ? 0 : 100,
            useNativeDriver: false
        }).start();
    };

    const toggleAddItemBar = (animVal, val) => {

        Animated.timing(animVal, {
            toValue: val ? 0 : 150,
            useNativeDriver: false
        }).start();
    };

    const fetchLists = async () => {
        changeIsFetching(true);
        const rawList = await getList();
        if (rawList && rawList.lists) {
            changeList(rawList.lists);
            rawList.lists.forEach(el => {
                itemList.push(el.items);
                listAnimValues.push(new Animated.Value(0));
            });
            changeIsFetching(false)
            changeHasData(true);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleAddItem = () => {
        Animated.spring()
    }

    const renderListItems = ({ item }) => {
        return (
            <View style={{ width: '100%', height: listItemHeight, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderColor: '#bbb', borderTopWidth: 1 }}>
                <Text style={{ color: (item.bought ? 'green' : 'black') }}>{item.name}</Text>
            </View>
        );
    }

    const deleteListItem = async ({ item }) => {
        console.log("To delete: " + JSON.stringify(item));
        await removeItem(item.id);
        fetchLists();
    }

    const markItem = async ({ item }) => {
        console.log("To mark: " + JSON.stringify(item));
        await markItemAsPurchased(item.id);
        fetchLists();
    }

    const savePress = async (listName) => {
        console.log(listName);
        await changeListName(nameToChange, listName);
        fetchLists();
    }

    const deleteListFunc = async (listName) => {
        console.log("Deleting list " + listName);
        await deleteList(listName);
        fetchLists();
    }

    const renderList = ({ item }) => {

        const ind = list.indexOf(item);

        //console.log(item.items);

        let val = 0;
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 15, alignItems: 'center', overflow: 'hidden', justifyContent: 'space-evenly' }}>
                    <View style={[styles.boxVert, { height: listItemHeight }]}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {item.name}
                        </Text>
                    </View>

                    <View style={{ alignItems: 'center', width: '100%' }}>
                        <Animated.View style={{
                            width: '100%', height: listAnimValues[ind], paddingLeft: 10, paddingRight: 10, justifyContent: 'space-around'
                        }}>
                            {editPost ? (
                                <View style={{ alignItems: 'center', rowGap: 20 }}>
                                    <TextInput onChangeText={changeNameToChange} value={nameToChange} style={{ width: '50%', borderBottomWidth: 1, borderColor: 'gray' }} placeholder={'Name'} />
                                    <View style={{ width: '100%', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.buttonText} onPress={() => toggleAddItemBar(listAnimValues[ind], 1)}>CANCEL</Text>
                                        <Text style={styles.buttonText} onPress={async () => { savePress(item.name) }}>SAVE</Text>
                                    </View>
                                    <Text style={styles.buttonText} onPress={async () => { deleteListFunc(item.name) }}>DELETE</Text>
                                </View>
                            ) : (
                                <View style={{ rowGap: 20 }}>
                                    <TextInput onChangeText={changeItemToAdd} value={itemToAdd} style={{ width: '100%', borderBottomWidth: 1, borderColor: 'gray' }} placeholder={'Enter Item Here'} />
                                    <View style={[styles.boxVert, {}]}>
                                        <Text
                                            style={styles.buttonText}
                                            onPress={() => toggleAddItemBar(listAnimValues[ind], 1)}
                                        >CANCEL</Text>
                                        <Text
                                            style={styles.buttonText}
                                            onPress={async () => {
                                                await makeItem(item.listID, itemToAdd);
                                                toggleAddItemBar(listAnimValues[ind], 1);
                                                changeShowItemEntry(false);
                                                fetchLists();
                                            }
                                            }>SUBMIT</Text>
                                    </View>
                                </View>
                            )}

                        </Animated.View>
                        {hasData ? (
                            <SwipeListView
                                style={{ width: '100%', justifyContent: 'space-evenly', rowGap: 0 }}
                                data={item.items}
                                renderItem={renderListItems}
                                renderHiddenItem={(data, rowMap) => (
                                    <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderColor: '#bbb', borderBottomWidth: 1, borderTopWidth: 1 }}>
                                        <TouchableOpacity style={{ width: swipeSize, height: listItemHeight, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }} onPress={() => console.log(deleteListItem(data))} >
                                            <Text style={{ color: 'white' }}>Delete</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ width: swipeSize, height: listItemHeight, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }} onPress={() => console.log(markItem(data))} >
                                            <Text style={{ color: 'white' }}>Purchased</Text>
                                        </TouchableOpacity>
                                    </View>

                                )}
                                leftOpenValue={swipeSize}
                                rightOpenValue={-swipeSize} />
                        ) : (
                            <></>
                        )}
                    </View>


                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '95%', alignItems: 'center', backgroundColor: 'white' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, paddingRight: 5 }}
                            onPress={() => {
                                changeEditPost(true);
                                changeShowItemEntry(!showItemEntry)
                                val = listAnimValues[ind].__getValue();
                                toggleAddItemBar(listAnimValues[ind], val);
                            }}>EDIT</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 30, paddingRight: 5 }}
                            onPress={() => {
                                changeEditPost(false);
                                changeShowItemEntry(!showItemEntry)
                                val = listAnimValues[ind].__getValue();
                                toggleAddItemBar(listAnimValues[ind], val);
                            }}>+</Text>

                    </View>
                </View>
            </View>

        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: color.primary, width: '100%', height: '100%', flex: 1 }}>
            <View style={[styles.boxVert, { paddingTop: 40, }]}>
                <Text style={[styles.title]}>Lists</Text>
                <Text style={[styles.title]} onPress={handleAddPostClick}>+</Text>
            </View>
            <Animated.View style={{ paddingBottom: 20, width: '100%', height: addListHeight, alignItems: 'center', justifyContent: 'space-around', overflow: 'hidden' }}>
                <TextInput style={{ backgroundColor: color.secondary, width: 300, height: '40%', paddingStart: 15, borderRadius: 15 }} onChangeText={changeListToAdd} value={listToAdd} placeholder='Enter list name here' />
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={[styles.buttonText, {color: 'red'}]} onPress={async () => { handleAddPostClick() }}>CANCEL</Text>
                    <Text style={[styles.buttonText, {color: 'green'}]} onPress={async () => {
                        await makeList(listToAdd);
                        fetchLists();
                        handleAddPostClick();
                    }}>CREATE</Text>
                </View>
            </Animated.View>
            {hasData ? (
                <FlatList
                    data={list}
                    renderItem={renderList}
                    contentContainerStyle={{ rowGap: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={() => fetchLists()} />
                    }
                ></FlatList>
            ) : (
                <Text>Loading...</Text>
            )}
        </SafeAreaView>
    );
}