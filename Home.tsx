import React from 'react'
import {View, Text, Button, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    <TouchableOpacity onPress={logout}>
      <Text>Log Out</Text>
    </TouchableOpacity>
  )
}
