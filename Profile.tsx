import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { getDocs, query, collection, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from './types/types';


const Tab = createMaterialTopTabNavigator();

export default function Profile({showError, username}:{showError: any, username: any}){

  const [user, setUser] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      showError('');
    }, [])
  );

  useEffect(() => {
    (async () => {
      var response = await getUserByUsername(username)
      setUser(response[0] || {});
    })();
  })

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


  return (
    <>
        <Tab.Navigator>
          <Tab.Screen name="Info">
            {(props) => <MainTab {...props} user={user}/>}
          </Tab.Screen>

          <Tab.Screen name="Academic" component={AchievementsTab} />
          <Tab.Screen name="Athletic" component={AthleticTab} />
          <Tab.Screen name="Clubs" component={ClubsTab} />
        </Tab.Navigator>
    </>
  );
};


const MainTab = ({user}:{user:any}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(user.about || '');

  const generateGravatarUrl = (email:string, size = 200) => {
    var MD5 = function(d:any){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d:any){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d:any){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d:any){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d:any,_:any){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d:any,_:any,m:any,f:any,r:any,i:any){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d:any,_:any){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d:any,_:any){return d<<_|d>>>32-_}    
    const emailHash = MD5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${emailHash}?s=500&d=identicon`;
  };

  useEffect(() => {
    if(!about){
      setAbout(user.about || '');
    }
  }, [isEditing])

  async function setFirestoreAbout(username:string, about:string){
    username = username.toLowerCase();
    const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
    const userDoc = querySnapshot.docs[0];
    const userDocRef = await doc(db,'users', userDoc.id);
    await updateDoc(userDocRef, { about: about });
    setIsEditing(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.tabContent}>
    <KeyboardAvoidingView
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <View style={styles.tabContent}>
      {user.username && (<><Image
        source={{uri: generateGravatarUrl(user.email)}}
        style={styles.profilePicture}
      />
     <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.username}>@{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <View style={styles.aboutMe}>
      {!isEditing ? (
        <>
        <Text style={styles.sectionTitle}>About Me</Text>

        <TouchableOpacity onPress={()=>{setIsEditing(true)}}>
            <Text style={styles.editText}>edit</Text>
        </TouchableOpacity>
        <Text>
          {user.about}
        </Text>
        </>
      ) 
      : (
        <>
        <Text style={styles.sectionTitle}>About Me</Text>
          <TextInput
          value={about}
          onChangeText={(text)=>{setAbout(text)}}
          multiline
          />
        
        <View style={styles.btnContainer}>
        <TouchableOpacity onPress={()=>{setFirestoreAbout(user.username, about)}} style={styles.confirmBtn}>
            <Text>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setIsEditing(false)}} style={styles.cancelBtn}>
            <Text>Cancel</Text>
        </TouchableOpacity>
        </View>
        
        </>
      )}
        
      </View>
      </>)}
      </View>
     </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
  );
};

const AchievementsTab = () => {
  return (
    <View style={styles.tabContent}>
      {/* Academic achievements content */}
      <Text>Academic Achievements Tab Content</Text>
    </View>
  );
};

const AthleticTab = () => {
  return (
    <View style={styles.tabContent}>
      {/* Athletic participation content */}
      <Text>Athletic Participation Tab Content</Text>
    </View>
  );
};

const ClubsTab = () => {
  return (
    <View style={styles.tabContent}>
      {/* Clubs and organizations content */}
      <Text>Clubs & Organizations Tab Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderColor:'black',
    borderWidth: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    color: '#5f9ea0',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  gpa: {
    fontSize: 16,
    marginBottom: 16,
  },
  tabContent: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
  },
  aboutMe: {
    minWidth: '100%',
    height: '50%',
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#5f9ea0',
    borderWidth: 2,
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  editText: {
    fontSize: 16,
    color: '#5f9ea0',
    marginBottom: 12,
  },

  confirmBtn: {
    backgroundColor: 'green', 
    borderRadius: 10, 
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },

  cancelBtn: {
    backgroundColor: 'red', 
    borderRadius: 10,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },

  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
},

});
