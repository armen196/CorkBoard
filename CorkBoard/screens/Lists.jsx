import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../styles';
import color from '../Colors';
import { getList, makeList, print } from '../scripts';

//let list = [];
export default function Lists({ navigation }) {

    const [showAddList, changeShowAddList] = useState(false);
    const [listToAdd, changeListToAdd] = useState(false);
    const [hasData, changeHasData] = useState(false);
    const [list, changeList] = useState([]);
    const animHeight = useRef(new Animated.Value(0)).current;

    const handleAddPostClick = async () => {
        changeShowAddList(!showAddList);
        togglePostBar();
    }

    const togglePostBar = () => {
        Animated.timing(animHeight, {
            toValue: showAddList ? 0 : 100,
            useNativeDriver: false
        }).start();
    };

    const fetchLists = async () => {
        const rawList = await getList();
        if (rawList && rawList.lists) {
            console.log("Updating lists");
            changeList(rawList.lists);
            changeHasData(true);
        }
    };

    useEffect(() => {
        fetchLists();
        //changeHasData(true);
        console.log("from useeffect: " + list);
    }, []);

    

    const renderListItem = ({ item }) => {
        console.log("Rendering item with name " + item);
        return (
            <View style={{ width: '45%', height: 300, backgroundColor: 'white', borderRadius: 15, margin: 10, padding: 10 }}>
                <Text>{item.name}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: color.primary, width: '100%', height: '100%' }}>
            <View style={[styles.boxVert, { paddingTop: 40, }]}>
                <Text style={[styles.title]}>Lists</Text>
                <Text style={[styles.title]} onPress={handleAddPostClick}>+</Text>
            </View>
            <Animated.View style={{ paddingBottom: 20, width: '100%', height: animHeight, alignItems: 'center', justifyContent: 'space-around', overflow: 'hidden' }}>
                <TextInput style={{ backgroundColor: color.secondary, width: 300, height: '40%', paddingStart: 15, borderRadius: 15 }} onChangeText={changeListToAdd} value={listToAdd} placeholder='Enter list name here' />
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Button
                        title="cancel"
                        color={color.red}
                        onPress={async () => {
                            //togglePostBar();
                            const tm = await getList();
                            console.log(tm);
                        }
                        } />
                    <Button
                        title="create"
                        color={color.green}
                        onPress={() => {
                            makeList(listToAdd);
                        }} />
                </View>
            </Animated.View>
            {hasData ? (
                <FlatList
                    //key={'_'}
                    //keyExtractor={item => item.id}
                    //contentContainerStyle={{ alignItems: 'center' }}
                    data={list}
                    renderItem={renderListItem}
                    numColumns={2}
                    style={{ rowGap: 20 }}
                    columnWrapperStyle={{ justifyContent: 'space-around', width: '100%' }}></FlatList>
            ) : (
                <></>
            )}

        </SafeAreaView>
    );
}