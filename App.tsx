import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Profile from './Profile';
import LogIn from './Login';
import Signup from './Signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [error, setError] = React.useState('');
  const [isSignedIn, setIsSignedIn] = React.useState('');
  const [up, setUp] = React.useState(false);
  
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
          <Tab.Navigator>
          <Tab.Screen name="Home" options={{headerShown: false}}>
            {(props) => <Home {...props} update={update} />}
          </Tab.Screen>

          <Tab.Screen name="Profile">
            {(props) => <Profile {...props} showError={setError} username={isSignedIn}/>}
          </Tab.Screen>
          </Tab.Navigator>
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
