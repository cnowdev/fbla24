import React, { useEffect } from 'react'
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, TextInput, TouchableOpacity,} from 'react-native'
import { collection, query, where, getDocs, setDoc, doc} from "firebase/firestore"; 
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
                logInUser(email);
                //console.log(await AsyncStorage.getItem('user'));
                showError('Logged in')
            }
        }
    }

    return (
        <View style={styles.container}>
          <Text style={styles.logo}>My App</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              value={email}
              onChangeText={(text) => setEmail(text)}
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
            />
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.signup}>Signup</Text>
          </TouchableOpacity>
        </View>
    );
}

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
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
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
    width: '80%',
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