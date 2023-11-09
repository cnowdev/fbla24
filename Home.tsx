import React from 'react'
import {View, Text, Button, TouchableOpacity, StyleSheet, Pressable} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from './types/types'

export default function Home({update}: {update: any}) {
  async function logout() {
    try {
      await AsyncStorage.removeItem('user')
    } catch (e) {
      console.log(e)
    }

    update();
  }


  return (
    <View style={styles.container}>
    <Text style={styles.bigboytext}>Home</Text>
    <Pressable style={styles.logoutBtn} onPress={logout}>
      <Text style={styles.logouttext}>Log Out</Text>
    </Pressable>
    </View>
  )

}

const styles = StyleSheet.create({
  bigboytext: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#5f9ea0',
  },
  container: {
    marginTop: '15%',
    marginLeft: '10%'
  },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 4,
    elevation: 3,
    width: '20%'
  },
  logouttext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
