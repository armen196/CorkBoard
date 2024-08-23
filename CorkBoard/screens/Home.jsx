import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors';

export default function HomeScreen() {
    return (
        <Text>Welcome Home!</Text>
    );
}