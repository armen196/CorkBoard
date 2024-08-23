import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors'

export default function Login({ navigation }) {
  const [userName, onChangeUser] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const handleLogin = () => {
    navigation.navigate('Home');
  }


  return (
    <SafeAreaView style={styles.loginContainer}>
      <Text style={styles.title}>Cork Board</Text>
      <View style={{height: '30%', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={styles.textField}>
          <TextInput style={styles.textBox} onChangeText={onChangeUser} value={userName} placeholder='User Name' />
        </View>
        <View style={styles.textField}>
          <TextInput style={styles.textBox}  secureTextEntry={true} onChangeText={onChangePassword} value={password} placeholder='Password' />
        </View>
        <Button 
        title='Submit' 
        color={color.textPrimary}
        onPress={handleLogin}/>
      </View>
    </SafeAreaView>
  );

}