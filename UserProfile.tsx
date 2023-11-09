import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { getDocs, query, collection, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User, ProfileType, Activity } from './types/types';


const Tab = createMaterialTopTabNavigator();

export default function UserProfile({showError, username}:{showError: any, username: any}){
  const emptyUser : User = {
    email: "",
    followers: [],
    name: "",
    password: "",
    posts: [],
    username: "",
    about: "", 
    id: ""
  }
  
  const emptyProfile:ProfileType = {
    id: '',
    creator_id: '',
    classes: [],
    academic: [],
    athletic: [],
    achievements: [],
    club: [],
  }

  const [user, setUser] = useState(emptyUser);
  const [up, setUp] = useState(false)
  const [profile, setProfile] = useState(emptyProfile);

  useFocusEffect(
    React.useCallback(() => {
      showError('');
    }, [])
  );

  useEffect(() => {
    (async () => {
      if(!user.id){
        var userResponse = await getUserByUsername(username)
        setUser(userResponse[0] || emptyUser);
      }
      if(!profile.id){
        var profileResponse = await getProfile(user.id || '')
        setProfile(profileResponse[0] || emptyProfile);
      }
    })();
  })

  useEffect(() => {
    (async () => {
      var userResponse = await getUserByUsername(username)
      setUser(userResponse[0] || emptyUser);
      var profileResponse = await getProfile(user.id || '')
      setProfile(profileResponse[0] || emptyProfile);
    })();
  }, [up]);

  async function getProfile(user_id:string){
    const querySnapshot = await getDocs(query(collection(db, "profile"), where("creator_id", "==", user_id)));
    let data:Array<ProfileType> = [];
        querySnapshot.forEach((doc) => {
            let profile: ProfileType = {
              id: doc.id,
              creator_id: doc.data().creator_id,
              classes: doc.data().classes,
              academic: doc.data().academic?.map((x:any) => {return {
                title: x.title,
                description: x.description,
                startedAt: `${('0'+ (new Date(x.startedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.startedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.startedAt * 1000).getUTCFullYear()}`,
                endedAt: x.endedAt ? `${('0'+ (new Date(x.endedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.endedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.endedAt * 1000).getUTCFullYear()}` : null,
              }}),

              athletic: doc.data().athletic?.map((x:any) => {return {
                title: x.title,
                description: x.description,
                startedAt: `${('0'+ (new Date(x.startedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.startedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.startedAt * 1000).getUTCFullYear()}`,
                endedAt: x.endedAt ? `${('0'+ (new Date(x.endedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.endedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.endedAt * 1000).getUTCFullYear()}` : null,
              }}),

              achievements: doc.data().achievements,

              club: doc.data().club?.map((x:any) => {return {
                title: x.title,
                description: x.description,
                startedAt: `${('0'+ (new Date(x.startedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.startedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.startedAt * 1000).getUTCFullYear()}`,
                endedAt: x.endedAt ? `${('0'+ (new Date(x.endedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.endedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.endedAt * 1000).getUTCFullYear()}` : null,
              }}),
            }
            data.push(profile);
        });
    return data;
  }

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

  function update(){
    setUp(!up)
  }


  return (
    <>
        <Tab.Navigator>
          <Tab.Screen name="Info">
            {(props) => <MainTab {...props} user={user} update={update}/>}
          </Tab.Screen>
          <Tab.Screen name="Academic">
            {(props) => <AcademicTab {...props} academic={profile.academic ?? []} schedule={profile.classes ?? []} creator_id={profile.creator_id ?? ''} update={update}/>}
          </Tab.Screen>

          <Tab.Screen name="Athletic">
            {(props) => <AthleticTab {...props} athletic={profile.athletic ?? []} creator_id={profile.creator_id ?? ''} update={update}/>}
          </Tab.Screen>

          <Tab.Screen name="Club">
            {(props) => <ClubsTab {...props} club={profile.club ?? []} creator_id={profile.creator_id ?? ''} update={update} schedule={profile.achievements}/>}
          </Tab.Screen>
        </Tab.Navigator>
    </>
  );
};


const MainTab = ({user, update}:{user:any, update: Function}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(user.about || '');
  const scrollViewRef = useRef(null)
  
  const generateGravatarUrl = (email:string, size = 200) => {
    var MD5 = function(d:any){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d:any){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d:any){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d:any){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d:any,_:any){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d:any,_:any,m:any,f:any,r:any,i:any){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d:any,_:any){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d:any,_:any){return d<<_|d>>>32-_}    
    const emailHash = MD5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${emailHash}?s=500&d=identicon`;
  };


  useEffect(() => {
    if(about != user.about){
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
    update();
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

      {about.length >= 300 && (<Text style = {styles.errorMsg}> About me must be under 300 characters.</Text>)}
      <View style={styles.aboutMe}>
      <ScrollView ref={scrollViewRef} style={{flex: 1}}>
      <View style={{minWidth: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
      {!isEditing ? (
        <>
        <Text style={styles.sectionTitle}>About Me</Text>

        <TouchableOpacity onPress={()=>{setIsEditing(true)}}>
            <Text style={styles.editText}>Edit</Text>
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
          style={styles.aboutMeInp}
          placeholder='About Me'
          />
        
        <View style={styles.btnContainer}>
        {about.length >= 300 ? (
          <>
          <TouchableOpacity style={styles.confirmBtnDis}>
            <Text>Confirm</Text>
          </TouchableOpacity>
          </>
        ) : (
          <>
          <TouchableOpacity onPress={()=>{setFirestoreAbout(user.username, about)}} style={styles.confirmBtn}>
            <Text>Confirm</Text>
          </TouchableOpacity>
        </>
        )}

        

        <TouchableOpacity onPress={()=>{setIsEditing(false)}} style={styles.cancelBtn}>
            <Text>Cancel</Text>
        </TouchableOpacity>
        </View>
        
        </>
      )}
      </View>
      </ScrollView> 
      </View>
      </>)}
      </View>
     </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
  );
};

const AcademicTab = ({ academic, schedule, creator_id, update }: {
  academic: Array<Activity> | [],
  schedule: Array<string> | [],
  creator_id: string,
  update: Function
}) => {
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([...schedule]);
  const [scheduleTxt, setScheduleTxt] = useState('');

  
  useEffect(() => {
    setEditedSchedule([...schedule]);
  }, [schedule]);

  function toggleEditing() {
    setIsEditingSchedule(!isEditingSchedule);
  }

  function areArraysIdentical(arr1:Array<any>, arr2:Array<any>) {
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
  
    return true;
  }

  async function updateSchedule() {
    toggleEditing();
    if(!areArraysIdentical(editedSchedule, schedule)){
      const querySnapshot = await getDocs(query(collection(db, 'profile'), where('creator_id', '==', creator_id)));
      const profileDoc = querySnapshot.docs[0];
      const profileDocRef = doc(db, 'profile', profileDoc.id);
      await updateDoc(profileDocRef, { classes: editedSchedule });
    }
    update();
  }

  function addClass() {
    if (scheduleTxt.trim() !== '') {
      setEditedSchedule([...editedSchedule, scheduleTxt]);
      setScheduleTxt('');
    }
  }

  function removeClass(index: number) {
    const newSchedule = [...editedSchedule];
    newSchedule.splice(index, 1);
    setEditedSchedule(newSchedule);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={50}>
    <ScrollView style={styles.scheduleContainer}>
    <View style={{height: 30}}/>
      <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        {!isEditingSchedule && (
          <Text onPress={toggleEditing} style={styles.editText}>
            Edit
          </Text>
        )}
        {isEditingSchedule && (
          <Text onPress={updateSchedule} style={styles.editText}>
            Save
          </Text>
        )}

        <View>
          {editedSchedule.length === 0 ? (
            <Text style={styles.errorMsg}>Nothing to see here...</Text>
          ) : (
            <View style={styles.table}>
              {/* Header row */}
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Period</Text>
                <Text style={styles.tableHeaderCell}>Class</Text>
              </View>
              {/* Schedule rows */}
              {editedSchedule?.map((x, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{`Period ${index + 1}`}</Text>
                  {isEditingSchedule ? (
                    <TextInput
                      onChangeText={(text) => {
                        const newEditedSchedule = [...editedSchedule];
                        newEditedSchedule[index] = text;
                        setEditedSchedule(newEditedSchedule);
                      }}
                      value={x}
                      style={styles.tableCell}
                      multiline={true}
                    />
                  ) : (
                    <Text style={styles.tableCell}>{x}</Text>
                  )}

                  {isEditingSchedule && (
                    <TouchableOpacity
                      onPress={() => removeClass(index)}
                      style={styles.dltBtn}
                    >
                      <Text style={styles.dltTxt}>x</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {isEditingSchedule && (
            <>
              <TextInput
                onSubmitEditing={addClass}
                onChangeText={(text) => setScheduleTxt(text)}
                value={scheduleTxt}
                style={styles.scheduleInp}
                placeholder="New Class"
              />
              <TouchableOpacity onPress={addClass} style={styles.addBtn}>
                <Text style={styles.addTxt}>+</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
            <ActivitySection academic={academic} update={update} creator_id={creator_id} title='Academic' section_name='academic'/>
      <View style={{height: 75}}/>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const AthleticTab = ({athletic, update, creator_id}:{athletic: Array<Activity>, update: Function, creator_id: string}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={50}>
      <ScrollView style={styles.scheduleContainer}>
      <View style={{height: 50}}/>
        <View style={styles.scheduleSection}>
          <ActivitySection academic={athletic} update={update} creator_id={creator_id} title='Athletic' section_name='athletic'/>
        </View>
      <View style={{height: 30}}/>
      </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const ClubsTab = ({club, update, creator_id, schedule}:{club: Array<Activity>, update: Function, creator_id: string, schedule:Array<string>}) => {
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([...schedule]);
  const [scheduleTxt, setScheduleTxt] = useState('');

  
  useEffect(() => {
    setEditedSchedule([...schedule]);
  }, [schedule]);

  function toggleEditing() {
    setIsEditingSchedule(!isEditingSchedule);
  }

  function areArraysIdentical(arr1:Array<any>, arr2:Array<any>) {
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
  
    return true;
  }

  async function updateSchedule() {
    toggleEditing();
    if(!areArraysIdentical(editedSchedule, schedule)){
      const querySnapshot = await getDocs(query(collection(db, 'profile'), where('creator_id', '==', creator_id)));
      const profileDoc = querySnapshot.docs[0];
      const profileDocRef = doc(db, 'profile', profileDoc.id);
      await updateDoc(profileDocRef, { achievements: editedSchedule });
    }
    update();
  }

  function addClass() {
    if (scheduleTxt.trim() !== '') {
      setEditedSchedule([...editedSchedule, scheduleTxt]);
      setScheduleTxt('');
    }
  }

  function removeClass(index: number) {
    const newSchedule = [...editedSchedule];
    newSchedule.splice(index, 1);
    setEditedSchedule(newSchedule);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      keyboardVerticalOffset={50}>
      <ScrollView style={styles.scheduleContainer}>
      <View style={{height: 50}}/>
        <View style={styles.scheduleSection}>
          <ActivitySection academic={club} update={update} creator_id={creator_id} title='Clubs' section_name='club'/>
        </View>
        
        <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {!isEditingSchedule && (
          <Text onPress={toggleEditing} style={styles.editText}>
            Edit
          </Text>
        )}
        {isEditingSchedule && (
          <Text onPress={updateSchedule} style={styles.editText}>
            Save
          </Text>
        )}

        <View>
          {editedSchedule.length === 0 ? (
            <Text style={styles.errorMsg}>Nothing to see here...</Text>
          ) : (
            <View style={styles.table}>
              {/* Header row */}
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Name</Text>
              </View>
              {/* Schedule rows */}
              {editedSchedule?.map((x, index) => (
                <View style={styles.tableRow} key={index}>
                  {isEditingSchedule ? (
                    <TextInput
                      onChangeText={(text) => {
                        const newEditedSchedule = [...editedSchedule];
                        newEditedSchedule[index] = text;
                        setEditedSchedule(newEditedSchedule);
                      }}
                      value={x}
                      style={styles.tableCell}
                      multiline={true}
                    />
                  ) : (
                    <Text style={styles.tableCell}>{x}</Text>
                  )}

                  {isEditingSchedule && (
                    <TouchableOpacity
                      onPress={() => removeClass(index)}
                      style={styles.dltBtn}
                    >
                      <Text style={styles.dltTxt}>x</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {isEditingSchedule && (
            <>
              <TextInput
                onSubmitEditing={addClass}
                onChangeText={(text) => setScheduleTxt(text)}
                value={scheduleTxt}
                style={styles.scheduleInp}
                placeholder="Add Achievement"
                multiline={true}
              />
              <TouchableOpacity onPress={addClass} style={styles.addBtn}>
                <Text style={styles.addTxt}>+</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={{height: 100}}/>
      </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const ActivitySection = ({ academic, update, creator_id, title, section_name}:{academic: Array<Activity>, update:Function, creator_id:string , title:string, section_name:string}) => {
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [editedAcademic, setEditedAcademic] = useState([...academic]);
  const [academicTitle, setAcademicTitle] = useState('');
  const [academicDescription, setAcademicDescription] = useState('');
  const [academicStartedAt, setAcademicStartedAt] = useState('');
  const [academicEndedAt, setAcademicEndedAt] = useState('');

  const toggleAcademicEditing = () => {
    setIsEditingAcademic(!isEditingAcademic);
  };

  async function updateAcademic() {
    let invalidDates = false
    editedAcademic.forEach((x:any)=>{
      if(!/^\d{2}-\d{2}-\d{4}$/.test(x.startedAt.toString())){
        invalidDates = true
      }
      if((x.endedAt && !/^\d{2}-\d{2}-\d{4}$/.test(x.endedAt.toString()))){
        invalidDates = true
      }
    })

    if(!invalidDates){
      toggleAcademicEditing();
      const querySnapshot = await getDocs(query(collection(db, 'profile'), where('creator_id', '==', creator_id)));
      const profileDoc = querySnapshot.docs[0];
      const profileDocRef = doc(db, 'profile', profileDoc.id);

      if(section_name == 'academic'){
        await updateDoc(profileDocRef, { academic: editedAcademic?.map((x:any)=>{
          var split_start = x.startedAt.split('-');
          var start = new Date(`${split_start[2]}-${split_start[0]}-${split_start[1]}`).getTime() / 1000;

          if(x.endedAt){
            var split_end = x.endedAt.split('-') ?? [];
          } else{
            var split_end = null
          }
          if(split_end){
            var end = new Date(`${split_end[2]}-${split_end[0]}-${split_end[1]}`).getTime() / 1000;
          } else{
            var end = 0
          }
          return {
            title: x.title,
            description: x.description,
            startedAt: start,
            endedAt: split_end ? end : null,
          }
        })});
      }

      if(section_name == 'athletic'){
        await updateDoc(profileDocRef, { athletic: editedAcademic?.map((x:any)=>{
          var split_start = x.startedAt.split('-');
          var start = new Date(`${split_start[2]}-${split_start[0]}-${split_start[1]}`).getTime() / 1000;

          if(x.endedAt){
            var split_end = x.endedAt.split('-') ?? [];
          } else{
            var split_end = null
          }
          if(split_end){
            var end = new Date(`${split_end[2]}-${split_end[0]}-${split_end[1]}`).getTime() / 1000;
          } else{
            var end = 0
          }
          return {
            title: x.title,
            description: x.description,
            startedAt: start,
            endedAt: split_end ? end : null,
          }
        })});
      }

      if(section_name == 'club'){
        await updateDoc(profileDocRef, { club: editedAcademic?.map((x:any)=>{
          var split_start = x.startedAt.split('-');
          var start = new Date(`${split_start[2]}-${split_start[0]}-${split_start[1]}`).getTime() / 1000;

          if(x.endedAt){
            var split_end = x.endedAt.split('-') ?? [];
          } else{
            var split_end = null
          }
          if(split_end){
            var end = new Date(`${split_end[2]}-${split_end[0]}-${split_end[1]}`).getTime() / 1000;
          } else{
            var end = 0
          }
          return {
            title: x.title,
            description: x.description,
            startedAt: start,
            endedAt: split_end ? end : null,
          }
        })});
      }
      update();
    }
  }

  
  function addAcademic() {
    if (academicTitle.trim() !== '' && academicDescription.trim() !== '' && academicStartedAt.trim() !== '') {
      const newAcademicEntry = {
        title: academicTitle,
        description: academicDescription,
        startedAt: academicStartedAt,
        endedAt: academicEndedAt ? academicEndedAt : null,
      };
      setEditedAcademic([...editedAcademic, newAcademicEntry]);
      setAcademicTitle('');
      setAcademicDescription('');
      setAcademicStartedAt('');
      setAcademicEndedAt('');
    }
  }
  useEffect(() => {
    setEditedAcademic([...academic]);
  }, [academic]);

  function removeAcademic(index: number) {
    const newAcademic = [...editedAcademic];
    newAcademic.splice(index, 1);
    setEditedAcademic(newAcademic);
  }
  

  return (
    <View style={styles.academicSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!isEditingAcademic && (
        <Text onPress={toggleAcademicEditing} style={styles.editText}>
          Edit
        </Text>
      )}
      {isEditingAcademic && (
        <Text onPress={updateAcademic} style={styles.editText}>
          Save
        </Text>
      )}
    <View>
        {editedAcademic.length === 0 ? (
          <Text style={styles.errorMsg}>Nothing to see here...</Text>
        ) : (
          <View>
            {editedAcademic?.map((entry, index) => (
              <View style={styles.academicCard} key={index}>
                
                {isEditingAcademic ? (
                  <>

                  <View style={{alignContent: 'flex-end', alignItems: 'flex-end',}}>
                    <TouchableOpacity onPress={() => removeAcademic(index)} style={styles.dltBtn}>
                      <Text style={styles.dltTxt}>x</Text>
                    </TouchableOpacity>
                  </View>   

                    <TextInput
                      onChangeText={(text) => {
                        const newEditedAcademic = [...editedAcademic];
                        newEditedAcademic[index].title = text;
                        setEditedAcademic(newEditedAcademic);
                      }}
                      value={entry.title}
                      style={styles.cardTitle}
                      placeholder='Title'
                    />
                    <TextInput
                      onChangeText={(text) => {
                        const newEditedAcademic = [...editedAcademic];
                        newEditedAcademic[index].description = text;
                        setEditedAcademic(newEditedAcademic);
                      }}
                      value={entry.description}
                      style={styles.cardDescription}
                      placeholder='Description'
                      multiline={true}
                    />
                    <View style={styles.row}>
                      <Text>Start Date: </Text>
                      <TextInput
                        onChangeText={(text) => {
                          const newEditedAcademic = [...editedAcademic];
                          newEditedAcademic[index].startedAt = text;
                          setEditedAcademic(newEditedAcademic);
                        }}
                        value={entry.startedAt.toString()}
                        style={styles.cardDate}
                        placeholder='Start Date (MM-DD-YYYY)'
                      />
                    </View>
                    {!/^\d{2}-\d{2}-\d{4}$/.test(editedAcademic[index].startedAt.toString()) && (
                      <Text style={styles.errorMsg}>Start date must be formatted MM-DD-YYYY.</Text>
                    )}

                    <View style={styles.row}>
                      <Text>End Date: </Text>
                      <TextInput
                        onChangeText={(text) => {
                          const newEditedAcademic = [...editedAcademic];
                          newEditedAcademic[index].endedAt = text;
                          setEditedAcademic(newEditedAcademic);
                        }}
                        value={entry.endedAt?.toString()}
                        style={styles.cardDate}
                        placeholder='End Date (MM-DD-YYYY)'
                      />
                    </View>
                    {entry.endedAt && !/^\d{2}-\d{2}-\d{4}$/.test(entry.endedAt.toString()) && (
                      <Text style={styles.errorMsg}>End date must be formatted MM-DD-YYYY or empty.</Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.cardTitle}>{entry.title}</Text>
                    <Text style={styles.cardDescription}>{entry.description}</Text>
                    <Text style={styles.cardDate}>Start Date: {entry.startedAt}</Text>
                    {entry.endedAt && (<Text style={styles.cardDate}>End Date: {entry.endedAt || '?'}</Text>)}
                  </>
                )}

              </View>
            ))}
          </View>
        )}

        {isEditingAcademic && (
          <>
            <View style={styles.academicCard}>
              <TextInput
                onChangeText={(text) => setAcademicTitle(text)}
                value={academicTitle}
                style={styles.cardTitle}
                placeholder="Title"
              />
              <TextInput
                onChangeText={(text) => setAcademicDescription(text)}
                value={academicDescription}
                style={styles.cardDescription}
                placeholder="Description"
                multiline={true}
              />
              <TextInput
                onChangeText={(text) => setAcademicStartedAt(text)}
                value={academicStartedAt.toString()}
                style={styles.cardDate}
                placeholder="Start Date (MM-DD-YYYY)"
              />
              <TextInput
                onChangeText={(text) => setAcademicEndedAt(text)}
                value={academicEndedAt.toString()}
                style={styles.cardDate}
                placeholder="End Date (MM-DD-YYYY)"
              />
            </View>
            <TouchableOpacity onPress={addAcademic} style={styles.addBtn}>
              <Text style={styles.addTxt}>+</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    marginBottom: 28,
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
    borderColor: '#5f9ea0',
    borderWidth: 2,
    padding: 20,
    paddingTop: 10,
  },
  errorMsg: {
    color: 'red',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  editText: {
    fontSize: 16,
    color: '#5f9ea0',
    marginBottom: 6,
  },
  aboutMeInp : {
    marginTop: 28,
    width: 240,
    borderColor: '#5f9ea0',
    borderWidth: .25,
    padding: 10,
  },
  confirmBtn: {
    backgroundColor: 'green', 
    borderRadius: 10, 
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  confirmBtnDis: {
    backgroundColor: 'gray', 
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

  scheduleSection: {
    marginBottom: 24,
  },
  scheduleContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    height: '100%',
  },
  table: {
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#5f9ea0',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#5f9ea0',
  },
  tableHeaderCell: {
    paddingVertical: 8,
    padding: 5,
    flex: 1,
    fontWeight: 'bold',
    backgroundColor: '#5f9ea0',
  },
  tableCell: { 
    paddingVertical: 8,
    padding: 5,
    flex: 1,
  },
  academicSection: {
    marginBottom: 24,
  },
  academicCard: {
    borderWidth: 1,
    borderColor: '#5f9ea0',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    marginBottom: 8,
  },

  dltBtn: {
    marginTop: 8,
    marginRight: 5,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 20, 
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dltTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  addBtn: {
    backgroundColor: 'green',
    borderRadius: 5,
    width: 350,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  
  addTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  scheduleInp: {
    marginBottom: 10,
    width: 350,
    height: 30,
    borderColor: '#5f9ea0',
    borderWidth: .75,
    padding: 5,
  },

  row: {
    flexDirection: 'row',
  },
});
