import React from 'react'
import {View, Text, Button, TouchableOpacity, StyleSheet, Pressable} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from './types/types'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Home({update, navigation}: {update: any, navigation: any}) {
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
    <View style={styles.circleButtonContainer}>
    <Pressable style={styles.circleButton} onPress={() => navigation.navigate('Post Creator')}>
        <MaterialCommunityIcons name="pencil" size={32} color="white" />
    </Pressable>
    </View>
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
    marginLeft: '10%',
    flex: 1,
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
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#005E7C',
  },
  circleButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 250,
    width: 84,
    height: 84,
    marginHorizontal: 2,
    borderWidth: 0,
    borderColor: '#0094C6',
    borderRadius: 42,
    padding: 3,
  },
});
