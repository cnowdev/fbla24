import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { collection, query, where, getDocs, setDoc, doc, addDoc} from "firebase/firestore"; 
import {db} from './firebase'
import { User, Post, ProfileType, Activity } from './types/types';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation, showError}:{navigation: any, showError: any}){
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameExists, setUsernameExists] = useState(false)
  const [usernameValid, setUsernameValid] = useState(true)
  const [email, setEmail] = useState('')
  const [emailExists, setEmailExists] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  useFocusEffect(
    React.useCallback(() => {
      showError('');
    }, [])
  );

  useEffect(() => { 
    (async () => {
      if(!/^[a-z0-9_]+$/.test(username)){
        if(username){
          setUsernameValid(false)
          setUsernameExists(false)
        }
      }else{
        setUsernameValid(true)
        var response = await getUserByUsername(username)
        if(response[0]){
          setUsernameExists(true)
        } else{
          setUsernameExists(false)
        }
      }
    })();
  }, [username]);

  useEffect(() => { 
    (async () => {
      if(!/^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+$/.test(email)){
        if(email){
          setEmailValid(false)
          setEmailExists(false)
        }
      } else {
        setEmailValid(true)
        var response = await getUserByEmail(email)
        if(response[0]){
          setEmailExists(true)
        } else{
          setEmailExists(false)
        }
      }
    })();
  }, [email]);


  const getUserByUsername = async (username:string) => {
    username = username.toLowerCase();
    const querySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", username)));
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
            }
            data.push(user);
        });
    return data;
  }

  const getUserByEmail = async (email:string) => {
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
            }
            data.push(user);
        });
    return data;
  }

  const addUser = async (user:User) => {
    const usersCollection = collection(db, 'users');
    const docRef = await addDoc(usersCollection, user);

    const profileCollection = collection(db, 'profile');
    let profile : ProfileType = {
      creator_id: docRef.id,
      classes: [],
      achievements: [],
      academic: [],
      atheletic: [],
      club: [],
    } 
    await addDoc(profileCollection, profile)

  }

  async function handleSignupPress(){
    var emailResp = await getUserByEmail(email)
    var userResp = await getUserByUsername(username)
    if(!username || !name || !email ||!password||!confirm){
      showError('Please enter all fields.')
    } else if(password != confirm){
      showError('Password and Confirm Password do not match.')
    } else if(!/^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+$/.test(email)){
      showError('Not a valid email.')
    } else if(!/^[a-z0-9_]+$/.test(username)){
      showError('Usernames must be lowercase alphanumeric.')
    } else if(emailResp[0]){
      showError('This email already has an account.')
    } else if (userResp[0]){
      showError('Username already exists.')
    }else{
      let user: User = {
        name: name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        followers: [],
        password: password,
        posts: [],
        about: "",
      }
      addUser(user)
      try {
        await AsyncStorage.setItem('user', username);
      } catch (e) {
        console.log(e)
      }

      showError('Successfully signed up!')
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -40 : 0}>
    <View style={styles.container}>
      <Text style={styles.logo}>My App</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          value = {username}
          onChangeText={(text)=>{setUsername(text)}}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={function(this:any) { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
        />
      </View>
      {!usernameValid && (<Text style={styles.errorText}>Usernames must be lowercase alphanumeric.</Text>)}
      {usernameExists && (<Text style={styles.errorText}>Username already exists.</Text>)}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name"
          placeholderTextColor="#003f5c"
          value = {name}
          onChangeText={(text)=>{setName(text)}}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={function(this:any) { this.thirdTextInput.focus(); }}
          ref={function(this:any, input) { this.secondTextInput = input; }}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value = {email}
          onChangeText={(text)=>{setEmail(text)}}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={function(this:any) { this.fourthTextInput.focus(); }}
          ref={function(this:any, input) { this.thirdTextInput = input; }}
        />
      </View>
      {!emailValid && (<Text style={styles.errorText}>Not a valid email.</Text>)}
      {emailExists && (<Text style={styles.errorText}>This email already has an account.</Text>)}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          value = {password}
          onChangeText={(text)=>{setPassword(text)}}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={function(this:any) { this.fifthTextInput.focus(); }}
          ref={function(this:any, input) { this.fourthTextInput = input; }}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          value = {confirm}
          onChangeText={(text)=>{setConfirm(text)}}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={handleSignupPress}
          ref={function(this:any, input) { this.fifthTextInput = input; }}
        />
      </View>
      {emailExists || usernameExists || !username || !name || !email || !password || !confirm ? (
        <TouchableOpacity disabled={true} style={styles.disSignupBtn} onPress={handleSignupPress}>
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
      ): (
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignupPress}>
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
      )}
    </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    minWidth: '100%',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#5f9ea0',
    marginTop: 40,
  },
  inputView: {
    minWidth: '80%',
    backgroundColor: '#e0ffff',
    borderRadius: 25,
    height: 50,
    marginTop: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  signupBtn: {
    minWidth: '80%',
    backgroundColor: '#5f9ea0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 5,
  },

  disSignupBtn: {
    minWidth: '80%',
    backgroundColor: 'gray',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 5,
  },
  signupText: {
    color: 'white',
  },

  errorText: {
    color:'red',
    bottom: 0,
    marginBottom: 0,
  },

});