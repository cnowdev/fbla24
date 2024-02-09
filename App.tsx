import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import UserProfile from './UserProfile';
import Profile from './Profile';
import LogIn from './Login';
import Signup from './Signup';
import Search from './Search';
import FAQPage from './FAQ';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import PostCreator from './PostCreator';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import PostViewer from './PostViewer';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [error, setError] = React.useState('');
  const [isSignedIn, setIsSignedIn] = React.useState('');
  const [up, setUp] = React.useState(false);

  async function logout() {
    try {
      await AsyncStorage.removeItem('user')
    } catch (e) {
      console.log(e)
    }

    update();
  }

  const logoutPrompt = () => {
    const title = "Logout";
    const message = 'Are you sure you want to sign out?';
    const buttons = [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      { text: 'Sign Out', onPress: () => logout()},
    ]

    Alert.alert(title, message, buttons);
  }
  
  function TabNavigator() {
    return (
  
      <Tab.Navigator>
      <Tab.Screen name="Home" options={{headerShown: false, tabBarIcon: (props) => <Entypo name="home" size={24} color={props.focused? 'blue' : 'black'} />}} children={(props) => <Home update={update} username={isSignedIn} {...props}/> }/>
      <Tab.Screen name="Search" options={{tabBarIcon: (props) => <AntDesign name="search1" size={24} color={props.focused? 'blue' : 'black'} />}}children={(props) => <Search {...props} showError={showError} username={isSignedIn} />} />
      <Tab.Screen name="Profile" options={{tabBarIcon: (props) => <Ionicons name="person" size={24} color={props.focused? 'blue' : 'black'} />, headerLeft: (props) => <SimpleLineIcons style= {{marginLeft: '5%'}}name="logout" size={24} color="red" onPress={logoutPrompt}/>}} children={ () => <UserProfile showError={setError} username={isSignedIn}/> } />
      <Tab.Screen name="FAQ" options={{tabBarIcon: (props) => <AntDesign name="questioncircleo" size={24} color={props.focused? 'blue' : 'black'} />}} children={ () => <FAQPage/> } />
      </Tab.Navigator>
    )
  }
  
  const getLoggedInUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        return value;
      } else{
        return null;
      }
    } catch (e) {
      console.log(e);
    }
  };

  function update(){
    setUp(!up);
  }

  useEffect(() => {
    (async () => {
      let user = await getLoggedInUserId() || '';
      if(user === null){
        setIsSignedIn('');
      } else{
        setIsSignedIn(user);
      }
    })();
  });

  function showError(message:string){
    setError(message);
  }

  return (
    <NavigationContainer>
      <StatusBar style='dark'></StatusBar>
       {error ? (
          <>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          </>
        ): (
          <>
          </>
        )}      
        {!isSignedIn ? (
          <Stack.Navigator>
          <Stack.Screen name="Log In" options={{headerShown: false}}>
            {(props) => <LogIn {...props} showError={showError} />}
          </Stack.Screen>

          <Stack.Screen name="Sign Up">
            {(props) => <Signup {...props} showError={showError} />}
          </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Back" children={() => <TabNavigator/>} options={{headerShown: false}}/>
            <Stack.Screen name="User Profile" children={(props) => <Profile {...props} showError={showError}/> } />
            <Stack.Screen name="Post Creator" children={(props) => <PostCreator {...props} username={isSignedIn}/>} options={{headerLeftLabelVisible: false, headerTransparent: true, headerTitle: ''}}/>
            <Stack.Screen name="Post Viewer" children={(props) => <PostViewer {...props} username={isSignedIn}/>} options={{headerLeftLabelVisible: false, headerTransparent: true, headerTitle: ''}}/>
          </Stack.Navigator>
        )}
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    height: 100,
    backgroundColor: 'red',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  errorText: {
    marginBottom: 15,
    color: 'white',
    fontSize: 20,
  },
});