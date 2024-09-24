import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button, TouchableOpacity, Alert, Animated, AppRegistry, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import color from '../Colors';
import { registerUser, signIn, getPosts, getGroupMembers, updateUsers } from '../scripts';
import HomeScreen from './Home';
import { messages } from '../codes';
import { DEBUG } from '../globals';
import Colors from '../Colors';

const GREEN = true;
const RED = false;
// export var posts = [
//   { username: 'Chanelle', post: 'There was a brown fox that quickly jumped over the moon', scaleValue: new Animated.Value(100), isPressed: false },
// ];


export default function Login({ navigation }) {
  const [userName, onChangeUser] = (DEBUG) ? React.useState('123') : React.useState('');
  const [password, onChangePassword] = (DEBUG) ? React.useState('123') : React.useState('');
  const [isLoginMessageShowing, showLoginMessage] = React.useState(false);
  const [errorMessage, changeErrorMessage] = React.useState('');
  const [messageBoxColor, changeMessageBoxColor] = React.useState('');
  const [showAccountSetUp, showSetup] = React.useState(false);
  const [firstName, changeFirstName] = React.useState('');
  const [lastName, changeLastName] = React.useState('');
  const [groupID, changeGroupID] = React.useState('');
  const [imageUri, setImageUri] = React.useState(null);
  const [image, setImage] = React.useState('');
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

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    setImage(result.assets[0].uri)

  }

  const showGroupAlert = (groupID, groupMembers) => {
    let memberList = "Are you sure you want to join this group? \n\nMembers: ";
    let len = groupMembers.length;
    let x = 1;

    groupMembers.forEach(element => {
      memberList += element.firstName;
      if (x < len) memberList += ', '

      x += 1;
    });
    Alert.alert(
      "Joining group " + groupID,
      memberList,
      [
        {
          text: 'CANCEL',
          onPress: () => { return false },
        },
        {
          text: 'OK',
          onPress: async () => {
            
            const result = await registerUser(userName, password, firstName, lastName, groupID, image);
            console.log(result);
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
      ]
    );
  }

  return (
    <SafeAreaView style={styles.loginContainer}>
      {DEBUG ? (
        <Text style={styles.title}>Cork Board debug</Text>
      ) : (
        <Text style={styles.title}>Cork Board</Text>
      )
      }

      <View style={{ width: '100%', rowGap: 10, height: 'fit-content', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {isLoginMessageShowing && (
          <View style={[styles.loginMessageBar, { backgroundColor: messageBoxColor }]}>
            <Text>{errorMessage}</Text>
          </View>
        )}
        <View style={{ paddingVertical: 20, rowGap: 20, backgroundColor: color.white, height: 'auto', width: '100%', alignItems: 'center', justifyContent: 'space-around', borderRadius: 15, minHeight: 200 }}>
          <View style={styles.textField}>
            <TextInput style={styles.textBox} onChangeText={onChangeUser} placeholder='User Name' />
          </View>
          <View style={styles.textField}>
            <TextInput style={styles.textBox} secureTextEntry={true} onChangeText={onChangePassword} placeholder='Password' />
          </View>
          {showAccountSetUp ? (
            <View style={{ justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ width: '30%', alignItems: 'center' }}>
                  <TextInput style={[styles.textBox, { width: '100%', fontSize: 10, paddingStart: 10, borderBottomWidth: 1, borderColor: 'gray' }]} onChangeText={changeFirstName} value={firstName} placeholder='FirstName' />
                </View>
                <View style={{ width: '30%', alignItems: 'center' }}>
                  <TextInput style={[styles.textBox, { width: '100%', fontSize: 10, paddingStart: 10, borderBottomWidth: 1, borderColor: 'gray' }]} onChangeText={changeLastName} value={lastName} placeholder='Last Name' />
                </View>
                <View style={{ width: '30%', alignItems: 'center' }}>
                  <TextInput style={[styles.textBox, { width: '100%', fontSize: 10, paddingStart: 10, borderBottomWidth: 1, borderColor: 'gray' }]} onChangeText={changeGroupID} value={groupID} placeholder='Home ID' />
                </View>
              </View>
              <TouchableOpacity style={[styles.boxVert, { width: '80%', padding: 20 }]} onPress={selectImage}>
                <Text>Add profile picture</Text>
                <View style={{ overflow: 'hidden', width: 60, height: 60, backgroundColor: Colors.primary, borderRadius: 100, alignItems: 'center', justifyContent: 'space-around' }}>
                  {image && <Image source={{uri: image}} style={{height: '100%', width: '100%'}}/>}
                </View>
              </TouchableOpacity>
              <View style={{ width: '50%' }}>
                <Button
                  title='submit'
                  color={color.textPrimary}
                  onPress={async () => {
                    if (firstName == '' || lastName == '' || groupID == '') {
                      changeMessageBar(RED, messages.ERROR_INVALID_DATA_ENTERED);
                    } else {
                      const groupMembers = await getGroupMembers(groupID)
                      showGroupAlert(groupID, groupMembers);
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
                  switch (result) {
                    case -1:
                      changeMessageBar(RED, messages.ERROR_SERVER_CONNECTION);
                      break;
                    case 1:
                      changeMessageBar(RED, messages.ERROR_USER_DONT_EXIST);
                      break;
                    default:
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