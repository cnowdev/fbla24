import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import UserProfile from './UserProfile';
import Profile from './Profile';
import LogIn from './Login';
import Signup from './Signup';
import Search from './Search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [error, setError] = React.useState('');
  const [isSignedIn, setIsSignedIn] = React.useState('');
  const [up, setUp] = React.useState(false);


  
  function TabNavigator() {
    return (
  
      <Tab.Navigator>
      <Tab.Screen name="Home" options={{headerShown: false, tabBarIcon: (props) => <Entypo name="home" size={24} color={props.focused? 'blue' : 'black'} />}} children={() => <Home update={update}/> }/>

      <Tab.Screen name="Search" options={{tabBarIcon: (props) => <AntDesign name="search1" size={24} color={props.focused? 'blue' : 'black'} />}}children={(props) => <Search {...props} showError={showError} username={isSignedIn} />} />
      <Tab.Screen name="Profile" options={{tabBarIcon: (props) => <Ionicons name="person" size={24} color={props.focused? 'blue' : 'black'} />}} children={ () => <UserProfile showError={setError} username={isSignedIn}/> } />




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
            <Stack.Screen name="User Profile" children={(props) => <Profile {...props} showError={showError}/> }/>
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