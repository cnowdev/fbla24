import React from 'react'
import { Post } from '../types/types'
import {View, Text, Button, TouchableOpacity, StyleSheet, Pressable, Image, ScrollView, ActivityIndicator, Share} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../types/types'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDocs, query, collection, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useIsFocused } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

export default function Post(post: Post, currentUserID: any, navigation: any, handleShare: any, handleLike: any) {
    return (
        <TouchableOpacity style={styles.postContainer} key={post.id} onPress={() => {
          navigation.navigate('Post Viewer', {post: {
            id: post.id,
            authorId: post.authorId,
            authorPfp: post.authorPfp,
            content: post.content,
            likes: post.likes,
            replyingTo: post.replyingTo,
          }})
        }}>
        
  
  
        <View style={styles.postHeader}>
        <Image source={{ uri: post.authorPfp }} style={styles.avatar} />
          <Text style={styles.username}>{post.authorId}</Text>
          <Text style={styles.createdAt}>{post.createdAt.toLocaleDateString()}</Text>
        </View>
        <Text style={styles.content}>{post.content}</Text>
  
        <View style={styles.interactionRow}>
          <TouchableOpacity style={styles.interactionItem} onPress={() => {handleLike(post)}}>
            {post.likes.includes(currentUserID!) ? <AntDesign name="heart" size={24} color="#fa2c8b" /> : <AntDesign name="hearto" size={24} color="black" />}
            <Text style={styles.interactionText}>{post.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionItem} onPress={() => {
            navigation.navigate('Post Creator', {
              post: post
            });
          }}>
            <Feather name="message-circle" size={24} color="black" />
            <Text style={styles.interactionText}></Text> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionItem} onPress={() => {
            handleShare(post);
          }}>
            <Feather name="share" size={24} color="black" />
            <Text style={styles.interactionText}></Text> 
          </TouchableOpacity>
        </View>
        
      </TouchableOpacity>
      )
}



const styles = StyleSheet.create({
    bigboytext: {
      fontWeight: 'bold',
      fontSize: 40,
      color: '#5f9ea0',
      marginLeft: '5%',
      marginBottom: '3%',
  
    },
    container: {
      marginTop: '15%',
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
      left: 270,
      width: 84,
      height: 84,
      marginHorizontal: 2,
      borderWidth: 0,
      borderColor: '#0094C6',
      borderRadius: 42,
      padding: 3,
    },
    postContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    postHeader: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    username: {
      fontWeight: 'bold',
      marginRight: 8,
      marginTop: '3%'
    },
    createdAt: {
      color: '#888',
      marginTop: '3%'
    },
    content: {
      marginBottom: 8,
    },
    postImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    interactionRow: {
      flexDirection: 'row',
  
      borderTopWidth: 0,
      borderTopColor: '#ddd',
      paddingTop: 8,
      marginTop: 8,
      marginLeft: '2%'
    },
    interactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    interactionText: {
      marginLeft: 4, // spacing between icon and text
      color: '#333',
      fontSize: 14,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  