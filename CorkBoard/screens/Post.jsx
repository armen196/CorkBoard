import React from 'react';
import { StatusBar, Dimensions } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors';

const DATA = [
    { id: '1', title: 'item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'item 1' },
    { id: '5', title: 'Item 2' },
    { id: '6', title: 'Item 3' },
    { id: '7', title: 'item 1' },
    { id: '8', title: 'Item 2' },
    { id: '9', title: 'Item 3' },
    { id: '10', title: 'item 1' },
    { id: '11', title: 'Item 2' },
    { id: '12', title: 'Item 3' },

];



export default function PostScreen() {

    const {height, width} = useWindowDimensions();

    const renderItem = ({ item }) => (
        <View style={[styles.itemBox, {width: width * .9}]}>
            <Text>
                {item.title}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.homeContainer}>
            <FlatList contentContainerStyle={styles.scrollView} data={DATA} renderItem={renderItem}>
                
            </FlatList>

        </SafeAreaView >
    );
}