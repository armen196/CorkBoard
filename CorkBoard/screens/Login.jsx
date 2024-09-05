import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button, TouchableOpacity, Alert, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import color from '../Colors';
import { registerUser, signIn, getPosts } from '../scripts';
import HomeScreen from './Home';
import { messages } from '../codes';
import { posts } from '../globals'; 

const GREEN = true;
const RED = false;
// export var posts = [
//   { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
// ];

export default function Login({ navigation }) {
  const [userName, onChangeUser] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [isLoginMessageShowing, showLoginMessage] = React.useState(false);
  const [errorMessage, changeErrorMessage] = React.useState('');
  const [messageBoxColor, changeMessageBoxColor] = React.useState('');
  const [showAccountSetUp, showSetup] = React.useState(false);
  const [firstName, changeFirstName] = React.useState('');
  const [lastName, changeLastName] = React.useState('');
  const [groupID, changeGroupID] = React.useState('');
  const red = 'rgba(255, 0, 0, .3)';
  const green = 'rgba(0, 255, 0, .3)';
  var signUpButton = 'Sign Up';

  /**
  * 
  * @param {boolean} color True: Green, False: Red
  * @param {string} message To display to users
  * 
  */
  function changeMessageBar(color, message) {
    if (color)
      changeMessageBoxColor(green);
    else
      changeMessageBoxColor(red);
    showLoginMessage(true);
    changeErrorMessage(message);
  }

  return (
    <SafeAreaView style={styles.loginContainer}>
      <Text style={styles.title}>Cork Board</Text>
      <View style={{ width: '100%', rowGap: 10, height: 'fit-content', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {isLoginMessageShowing && (
          <View style={[styles.loginMessageBar, { backgroundColor: messageBoxColor }]}>
            <Text>{errorMessage}</Text>
          </View>
        )}
        <View style={{ paddingVertical: 20, rowGap: 20, backgroundColor: color.white, height: 'auto', width: '100%', alignItems: 'center', justifyContent: 'space-around', borderRadius: 15, minHeight: 200 }}>
          <View style={styles.textField}>
            <TextInput style={styles.textBox} onChangeText={onChangeUser} value={userName} placeholder='User Name' />
          </View>
          <View style={styles.textField}>
            <TextInput style={styles.textBox} secureTextEntry={true} onChangeText={onChangePassword} value={password} placeholder='Password' />
          </View>
          {showAccountSetUp ? (
            <View style={{ height: 120, justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ width: '30%', alignItems: 'center' }}>
                  <TextInput style={[styles.textBox, { width: '100%', fontSize: 10, paddingStart: 10 }]} onChangeText={changeFirstName} value={firstName} placeholder='FirstName' />
                  <View style={{ height: 2, width: '80%', backgroundColor: 'black' }} />
                </View>
                <View style={{ width: '30%', alignItems: 'center' }}>
                  <TextInput style={[styles.textBox, { width: '100%', fontSize: 10, paddingStart: 10 }]} onChangeText={changeLastName} value={lastName} placeholder='Last Name' />
                  <View style={{ height: 2, width: '80%', backgroundColor: 'black' }} />
                </View>
                <View style={{ width: '30%', alignItems: 'center' }}>
                  <TextInput style={[styles.textBox, { width: '100%', fontSize: 10, paddingStart: 10 }]} onChangeText={changeGroupID} value={groupID} placeholder='Home ID' />
                  <View style={{ height: 2, width: '80%', backgroundColor: 'black' }} />
                </View>
              </View>
              <View style={{ width: '50%' }}>
                <Button
                  title='submit'
                  color={color.textPrimary}
                  onPress={async () => {
                    console.log("Register button clicked")
                    if (firstName == '' || lastName == '' || groupID == '') {
                      changeMessageBar(RED, messages.ERROR_INVALID_DATA_ENTERED);
                    } else {
                      const result = await registerUser(userName, password, firstName, lastName, groupID);
                      switch (result) {
                        case -1:
                          changeMessageBar(RED, messages.ERROR_SERVER_CONNECTION);
                          break;
                        case 0:
                          changeMessageBar(GREEN, messages.USER_ADDED_SUCCESSFULY);
                          showSetup(false);
                          break;
                        case 1:
                          changeMessageBar(RED, messages.ERROR_USERNAME_ALREADY_TAKEN);
                          break;
                        default:
                      }
                    }
                  }
                  } />
              </View>

            </View>
          ) : (
            <View style={{ rowGap: 20 }}>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>

                <Text style={styles.signUpText} onPress={async () => {
                  if (userName == '' || password == '') {
                    changeMessageBar(GREEN, 'Start by entering new username and password');
                  } else {
                    showSetup(true);
                  }

                }}>{signUpButton}</Text>
                <Text>Cant Remember Password</Text>
              </View>

              {/* Submit Button */}

              <Button
                title='Submit'
                color={color.textPrimary}
                onPress={async () => {
                  const result = await signIn(userName, password);
                  console.log(result);
                  switch (result) {
                    case -1:
                      changeMessageBar(RED, messages.ERROR_SERVER_CONNECTION);
                      break;
                    case 1:
                      changeMessageBar(RED, messages.ERROR_USER_DONT_EXIST);
                      break;
                    default:
                      //posts = await getPosts();
                      navigation.navigate('MainTabs');
                      break;
                  }

                }} />
            </View>
          )}


        </View>
      </View>

    </SafeAreaView>
  );

}