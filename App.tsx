import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import ExamplePage from './ExamplePage';
import LogIn from './Login';
import Signup from './Signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';


const Stack = createStackNavigator();

export default function App() {
  const [error, setError] = React.useState('');
  const [isSignedIn, setIsSignedIn] = React.useState(false);
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
      console.log(await getLoggedInUserId())
      if(await getLoggedInUserId() === null){
        setIsSignedIn(true);
      } else{
        setIsSignedIn(false);
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
      
        <Stack.Navigator>
        {isSignedIn ? (
          <>
          <Stack.Screen name="Log In">
            {(props) => <LogIn {...props} showError={showError} />}
          </Stack.Screen>

          <Stack.Screen name="Sign Up">
            {(props) => <Signup {...props} showError={showError} />}
          </Stack.Screen>
          </>
        ) : (
          <>
          <Stack.Screen name="Home">
            {(props) => <Home {...props} update={update} />}
          </Stack.Screen>
          <Stack.Screen name="Test" component={ExamplePage} />
          </>
        )}
        </Stack.Navigator>
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
