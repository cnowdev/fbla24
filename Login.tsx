import React, { useEffect, useRef } from 'react'

import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,} from 'react-native'
import { collection, query, where, getDocs} from "firebase/firestore"; 
import {db} from './firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, Post} from './types/types'
import { useFocusEffect } from '@react-navigation/native';


export default function LogIn({ navigation, showError}:{navigation: any, showError: any}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    useFocusEffect(
      React.useCallback(() => {
        showError('');
      }, [])
    );
  

    const logInUser = async (value:string) => {
        try {
          await AsyncStorage.setItem('user', value);
        } catch (e) {
          console.log(e)
        }
    };


    const getUser = async (email:string) => {
        email = email.toLowerCase();
        const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));
        let data:Array<User> = [];
        querySnapshot.forEach((doc) => {
            let user: User = {
              id: doc.id,
              name: doc.data().name,
              username: doc.data().username,
              email: doc.data().email,
              followers: doc.data().followers,
              password: doc.data().password,
              posts: doc.data().posts,
              about: doc.data().about,
              hours: doc.data().hours,
            }
            data.push(user);
        });
        return data;
    }

    async function handleLogin() {
        if(!email || !password) {
            showError('Please enter an email and password')
            return;
        } else {
            var user = await getUser(email);
            console.log(user);
            if(user.length == 0) {
                showError('Email or password is incorrect')
                return;
            }
            if(user[0].password != password) {
                showError('Email or password is incorrect')
                return;
            } else{
                logInUser(user[0].username);
                //console.log(await AsyncStorage.getItem('user'));
                showError('Logged in')
            }
        }
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={styles.keyboardContainer}>
        
        <View style={styles.bcontainer}>
          <Text style={styles.logo}>InFBLA</Text>
        </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCorrect={false}
              autoCapitalize="none"
              onSubmitEditing={function(this:any) { this.secondTextInput.focus(); }}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
              autoCorrect={false}
              autoCapitalize="none"
              onSubmitEditing={handleLogin}
              ref={function(this:any, input) { this.secondTextInput = input; }}
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.signup}>Signup</Text>
          </TouchableOpacity>
        </View>  
        </TouchableWithoutFeedback>    
    );   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    minWidth: '100%',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#5f9ea0',
    marginBottom: 40,
  },
  inputView: {
    minWidth: '80%',
    backgroundColor: '#e0ffff',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    minWidth: '80%',
    backgroundColor: '#5f9ea0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  forgot: {
    color: '#5f9ea0',
    fontSize: 12,
  },
  signup: {
    color: '#5f9ea0',
    fontSize: 12,
    marginTop: 20,
  },
});