import React, { useEffect, useState } from 'react'
import {View, Text, Button, TouchableOpacity, StyleSheet, Pressable, TextInput, Image, TouchableWithoutFeedback, Keyboard} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebase';
import { getDocs, query, collection, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { User, Post } from './types/types';
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 


const DismissKeyboard = ({children}: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);


export default function PostCreator({username, navigation, route}: {username: string, navigation:any, route:any}) {

  const [currentUser, setCurrentUser] = useState<User>();
  const [pfp, setPfp] = useState<string>('')

  const [postContent, setPostContent] = useState<string>('');

    
    const generateGravatarUrl = (email:string, size = 200) => {
        var MD5 = function(d:any){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d:any){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d:any){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d:any){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d:any,_:any){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d:any,_:any,m:any,f:any,r:any,i:any){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d:any,_:any){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d:any,_:any){return d<<_|d>>>32-_}    
        const emailHash = MD5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${emailHash}?s=500&d=identicon`;
    };

    const createPost =  async (authorId: string, content: string) => {
      const postRef = doc(collection(db, 'posts'));
      const post: Post = {
        authorId: authorId,
        content: content,
        createdAt: new Date(),
        likes: [],
        replyingTo: route.params?.post?.id || null,
      }

      await setDoc(postRef, post);

    }



//useEffect: code within only runs when the component is first rendered
    useEffect(() => {
      // function to information about the current user
      const getCurrentUser = async(username: string) => {
        let q = query(collection(db, 'users'), where('username' , '==', username));
        const querySnapshot = await getDocs(q);
        const userDoc =  querySnapshot.docs[0]
        return userDoc;
    }
      // fetch the current user, then save their information to a useState
      getCurrentUser(username).then((doc) => {
        setCurrentUser({
          id: doc.id,
          email: doc.data().email,
          followers: doc.data().followers,
          name: doc.data().name,
          password: doc.data().password,
          posts: doc.data().posts,
          username: doc.data().username,
          about: doc.data().about,
          hours: doc.data().hours,
        });

        //set the users' profile picture state to their gravatar
        setPfp(generateGravatarUrl(doc.data().email));
      });


    }, [username])


  if(route.params?.post) {
    let post = route.params.post;
    return (
      <DismissKeyboard>
      <View>
              <View style={styles.postContainer} key={post.id}>
      


      <View style={styles.postHeader}>
      <Image source={{ uri: post.authorPfp }} style={styles.avatar} />
        <Text style={styles.username}>{post.authorId}</Text>
      </View>
      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.interactionRow}>
        <TouchableOpacity style={styles.interactionItem}>
          <AntDesign name="hearto" size={24} color="black" />
          <Text style={styles.interactionText}>{post.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionItem}>
          <Feather name="message-circle" size={24} color="black" />
          <Text style={styles.interactionText}>34</Text> 
        </TouchableOpacity>
      </View>
      
    </View>
        <View style={styles.container}>
          
          <View>
            <View style={styles.inputContainer}>
              <Image
                source={{uri: pfp || 'https://www.gravatar.com/a'}}
                style={styles.profilePicture}
              />
              <TextInput style={styles.textInput} multiline={true} placeholder="What's on your mind?" onChange={(value) => setPostContent(value.nativeEvent.text)}/>
              <TouchableOpacity style={styles.postBtn} onPress={async() => {
                await createPost(currentUser!.id!, postContent);
                navigation.navigate('Home');
              }}>
                <Text style={styles.postBtnText}>Reply</Text>
              </TouchableOpacity>
    
            </View>
          </View>
        </View>
      </View>     
      </DismissKeyboard> 
  )    
  }  
  return (
    <View style={styles.container}>
        
        <View>
          <View style={styles.inputContainer}>
            <Image
              source={{uri: pfp || 'https://www.gravatar.com/a'}}
              style={styles.profilePicture}
            />
            <TextInput style={styles.textInput} multiline={true} placeholder="What's on your mind?" onChange={(value) => setPostContent(value.nativeEvent.text)}/>
            <TouchableOpacity style={styles.postBtn} onPress={async() => {
              await createPost(currentUser!.id!, postContent);
              navigation.navigate('Home');
            }}>
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
    
          </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        marginTop: '15%',
        marginLeft: '10%',
        marginRight: '10%',
        flex: 1,
      },
    inputContainer: {
        borderRadius: 100,
        width: 300
    },
      textInput: {
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginTop: '2%'
      },
      postBtn: {
        minWidth: '80%',
        backgroundColor: '#5f9ea0',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
      },
      postBtnText: {
        color: 'white'
      },
      profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
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
      postContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: '30%'
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
})
