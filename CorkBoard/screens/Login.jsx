import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button, TouchableOpacity } from 'react-native';
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
      <View style={{ backgroundColor: color.white, height: '40%', width: '100%', alignItems: 'center', justifyContent: 'space-around', borderRadius: 15, minHeight: 200 }}>
        <View style={styles.textField}>
          <TextInput style={styles.textBox} onChangeText={onChangeUser} value={userName} placeholder='User Name' />
        </View>
        <View style={styles.textField}>
          <TextInput style={styles.textBox} secureTextEntry={true} onChangeText={onChangePassword} value={password} placeholder='Password' />
        </View>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={styles.signUpText}>Sign Up</Text>
          <Text>Cant Remember Password</Text>
        </View>
        <Button
          title='Submit'
          color={color.textPrimary}
          onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );

}