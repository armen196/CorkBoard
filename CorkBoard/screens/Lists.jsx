import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../styles';
import color from '../Colors';
import { getList, makeItem, makeList, markItemAsPurchased, print, removeItem } from '../scripts';
import { SwipeListView } from 'react-native-swipe-list-view';
import Bills from './Bills';
//let list = [];
const listAnimValues = [];
const itemList = [];
export default function Lists({ navigation }) {

    const [showAddList, changeShowAddList] = useState(false);
    const [listToAdd, changeListToAdd] = useState(false);
    const [hasData, changeHasData] = useState(false);
    const [list, changeList] = useState([]);
    const [itemToAdd, changeItemToAdd] = useState('');
    const [showItemEntry, changeShowItemEntry] = useState(false);
    const [isFetching, changeIsFetching] = useState(false);
    const addListHeight = useRef(new Animated.Value(0)).current;
    const addItemHeight = useRef(new Animated.Value(0)).current;
    const swipeSize = 70;

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
            toValue: val ? 0 : 70,
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
            <View style={{ width: '100%', height: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
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

     

    const renderList = async ({ item }) => {
        const ind = list.indexOf(item);
        let val = 0;
        return (
            <View style={{ width: '45%', height: 300, backgroundColor: 'white', borderRadius: 15, alignItems: 'center', overflow: 'hidden' }}>
                <View style={styles.boxVert}>
                    <Text style={{ fontWeight: 'bold' }}>
                        {item.name}
                    </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 30 }}
                        onPress={() => {
                            changeShowItemEntry(!showItemEntry)
                            val = listAnimValues[ind].__getValue();
                            toggleAddItemBar(listAnimValues[ind], val);
                        }}>+</Text>
                </View>
                <Animated.View style={{ width: '100%', height: listAnimValues[ind], padding: 10 }}>
                    <TextInput onChangeText={changeItemToAdd} value={itemToAdd} style={{ width: '100%' }} placeholder={'Enter Item Here'} />
                    <View style={{ width: '100%', height: 1, backgroundColor: 'black' }}></View>
                    <View style={[styles.boxVert, { paddingTop: 10 }]}>
                        <Text
                            style={styles.buttonText}
                            onPress={() => toggleAddItemBar(listAnimValues[ind], 1)}
                        >CANCEL</Text>
                        <Text
                            style={styles.buttonText}
                            onPress={async () => {
                                await makeItem(item.listID, itemToAdd);
                                toggleAddItemBar(listAnimValues[ind], 1)
                                fetchLists();
                            }
                            }>SUBMIT</Text>
                    </View>
                </Animated.View>
                {hasData ? (
                    <SwipeListView
                        style={{ width: '100%' }}
                        data={item.items}
                        renderItem={renderListItems}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: swipeSize, height: 30, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }} onPress={() => console.log(deleteListItem(data))} >
                                    <Text style={{ color: 'white' }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: swipeSize, height: 30, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }} onPress={() => console.log(markItem(data))} >
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
                    <Button
                        title="cancel"
                        color={color.red}
                        onPress={async () => {
                            handleAddPostClick();
                        }
                        } />
                    <Button
                        title="create"
                        color={color.green}
                        onPress={async () => {
                            await makeList(listToAdd);
                            fetchLists();
                        }} />
                </View>
            </Animated.View>
            {hasData ? (
                <FlatList
                    data={list}
                    renderItem={renderList}
                    numColumns={2}
                    style={{ rowGap: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={() => fetchLists()} />
                    }
                    columnWrapperStyle={{ justifyContent: 'space-around', width: '100%', padding: 10 }}></FlatList>
            ) : (
                <></>
            )}
            {/* <SwipeListView
                style={{height: '50%', backgroundColor: 'blue', width: '100%'}}
                data={listData}
                renderItem={(data, rowMap) => (
                    <View style={{backgroundColor: 'orange', width: '100%', height: 50}}>
                        <Text>hmm</Text>
                    </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View>
                        <Text>asdf</Text>
                    </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-75}/> */}


        </SafeAreaView>
    );
}