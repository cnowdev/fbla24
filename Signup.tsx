import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, setDoc, doc, addDoc} from "firebase/firestore"; 
import {db} from './firebase'
import { User, Post } from './types/types';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation, showError}:{navigation: any, showError: any}){
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [usernameExists, setUsernameExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      showError('');
    }, [])
  );

  useEffect(() => { 
    (async () => {
      var response = await getUserByUsername(username)
      if(response[0]){
        setUsernameExists(true)
      } else{
        setUsernameExists(false)
      }
    })();
  }, [username]);

  useEffect(() => { 
    (async () => {
      var response = await getUserByEmail(email)
      if(response[0]){
        setEmailExists(true)
      } else{
        setEmailExists(false)
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
            }
            data.push(user);
        });
    return data;
  }

  const addUser = async (user:User) => {
    console.log((({ id, ...rest }) => rest)(user))

    const usersCollection = collection(db, 'users');
    await addDoc(usersCollection, (({ id, ...rest }) => rest)(user));
  }

  async function handleSignupPress(){
    if(!username || !name || !email ||!password||!confirm){
      showError('Please enter all fields.')
    } else if(password != confirm){
      showError('Password and Confirm Password do not match.')
    } else{
      let user: User = {
        id: username,
        name: name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        followers: [],
        password: password,
        posts: [],
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
    <View style={styles.container}>
      <Text style={styles.logo}>My App</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          value = {username}
          onChangeText={(text)=>{setUsername(text)}}
        />
      </View>
      {usernameExists && (<Text style={styles.errorText}>Username already exists.</Text>)}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name"
          placeholderTextColor="#003f5c"
          value = {name}
          onChangeText={(text)=>{setName(text)}}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value = {email}
          onChangeText={(text)=>{setEmail(text)}}
        />
      </View>
      {emailExists && (<Text style={styles.errorText}>This email already has an account.</Text>)}
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          value = {password}
          onChangeText={(text)=>{setPassword(text)}}
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
        />
      </View>
      {emailExists || usernameExists ? (
        <TouchableOpacity disabled={true} style={styles.disSignupBtn} onPress={handleSignupPress}>
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
      ): (
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignupPress}>
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#5f9ea0',
    marginTop: 40,
  },
  inputView: {
    width: '80%',
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
    width: '80%',
    backgroundColor: '#5f9ea0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },

  disSignupBtn: {
    width: '80%',
    backgroundColor: 'gray',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
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