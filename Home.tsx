import React from 'react'
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native'
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
    <View>
    <Text style={styles.bigboytext}>Home</Text>
    <TouchableOpacity onPress={logout}>
      <Text>Log Out</Text>
    </TouchableOpacity>
    </View>
  )

}

const styles = StyleSheet.create({
  bigboytext: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#5f9ea0',
    marginBottom: 40,
  },
});
