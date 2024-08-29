import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors';
import { registerUser, signIn } from '../scripts';

export default function Login({ navigation }) {
  const [userName, onChangeUser] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [isLoginMessageShowing, showLoginMessage] = React.useState(false);
  const [errorMessage, changeErrorMessage] = React.useState('');
  const [messageBoxColor, changeMessageBoxColor] = React.useState('');
  const red = 'rgba(255, 0, 0, .3)';
  const green = 'rgba(0, 255, 0, .3)';
  return (
    <SafeAreaView style={styles.loginContainer}>
      <Text style={styles.title}>Cork Board</Text>
      <View style={{ width: '100%', rowGap: 10, height: 'fit-content', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {isLoginMessageShowing && (
          <View style={[styles.loginMessageBar, {backgroundColor: messageBoxColor}]}>
            <Text>{errorMessage}</Text>
          </View>
        )}
        <View style={{ backgroundColor: color.white, height: '60%', width: '100%', alignItems: 'center', justifyContent: 'space-around', borderRadius: 15, minHeight: 200 }}>
          <View style={styles.textField}>
            <TextInput style={styles.textBox} onChangeText={onChangeUser} value={userName} placeholder='User Name' />
          </View>
          <View style={styles.textField}>
            <TextInput style={styles.textBox} secureTextEntry={true} onChangeText={onChangePassword} value={password} placeholder='Password' />
          </View>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={styles.signUpText} onPress={() => {
              registerUser(userName, password);
              if (userName == '' || password == '') {
                changeMessageBoxColor(green);
                showLoginMessage(true);
                changeErrorMessage('Start by entering new username and password');
              }
            }}>Sign Up</Text>
            <Text>Cant Remember Password</Text>
          </View>
          <Button
            title='Submit'
            color={color.textPrimary}
            onPress={async () => {
              const result = await signIn(userName, password);
              console.log(result);
              switch (result) {
                case -1:
                  changeMessageBoxColor(red);
                  showLoginMessage(true);
                  changeErrorMessage('Error connecting to server');
                  break;
                case 1:
                  changeMessageBoxColor(red);
                  showLoginMessage(true);
                  changeErrorMessage('User does not exist');
                  break;
                default:
                  console.log(" asdf");
                  break;
              }
            }} />
        </View>
      </View>

    </SafeAreaView>
  );

}