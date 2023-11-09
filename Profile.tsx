import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { getDocs, query, collection, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User, ProfileType, Activity } from './types/types';


const Tab = createMaterialTopTabNavigator();

export default function UserProfile({showError, route}:{showError: any, route:any}){
    const [username, setUsername] = useState(route.params.username);
    const emptyUser : User = {
    email: "",
    followers: [],
    name: "",
    password: "",
    posts: [],
    username: "",
    about: "", 
    id: "",
    hours: 0,
    }

    const emptyProfile:ProfileType = {
    id: '',
    creator_id: '',
    classes: [],
    academic: [],
    athletic: [],
    achievements: [],
    club: [],
    performing: [],
    }

    const [user, setUser] = useState(emptyUser);
    const [up, setUp] = useState(false)
    const [profile, setProfile] = useState(emptyProfile);

    useFocusEffect(
        React.useCallback(() => {
            showError('');
        }, []),  
    );

    useEffect(() => {
        setUsername(route.params.username);
        update()
    }, [route.params.username])

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
        var profileResponse = await getProfile(userResponse[0].id || '')
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
                academic: doc.data().academic.map((x:any) => {return {
                    title: x.title,
                    description: x.description,
                    startedAt: `${('0'+ (new Date(x.startedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.startedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.startedAt * 1000).getUTCFullYear()}`,
                    endedAt: x.endedAt ? `${('0'+ (new Date(x.endedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.endedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.endedAt * 1000).getUTCFullYear()}` : null,
                }}),

                athletic: doc.data().athletic.map((x:any) => {return {
                    title: x.title,
                    description: x.description,
                    startedAt: `${('0'+ (new Date(x.startedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.startedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.startedAt * 1000).getUTCFullYear()}`,
                    endedAt: x.endedAt ? `${('0'+ (new Date(x.endedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.endedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.endedAt * 1000).getUTCFullYear()}` : null,
                }}),

                achievements: doc.data().achievements,

                club: doc.data().club.map((x:any) => {return {
                    title: x.title,
                    description: x.description,
                    startedAt: `${('0'+ (new Date(x.startedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.startedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.startedAt * 1000).getUTCFullYear()}`,
                    endedAt: x.endedAt ? `${('0'+ (new Date(x.endedAt * 1000).getUTCMonth() +1 )).slice(-2)}-${('0' + new Date(x.endedAt * 1000).getUTCDate()).slice(-2)}-${new Date(x.endedAt * 1000).getUTCFullYear()}` : null,
                }}),

                performing: doc.data().performing.map((x:any) => {return {
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
                hours: doc.data().hours
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
                {(props) => <MainTab {...props} user={user}/>}
            </Tab.Screen>
            <Tab.Screen name="Academic">
                {(props) => <AcademicTab {...props} academic={profile.academic ?? []} schedule={profile.classes ?? []} creator_id={profile.creator_id ?? ''} update={update} achievements={profile.achievements}/>}
            </Tab.Screen>

            <Tab.Screen name="Athletic">
                {(props) => <AthleticTab {...props} athletic={profile.athletic ?? []} creator_id={profile.creator_id ?? ''} update={update}/>}
            </Tab.Screen>

            <Tab.Screen name="Club">
                {(props) => <ClubsTab {...props} club={profile.club ?? []} creator_id={profile.creator_id ?? ''} update={update} performing={profile.performing}/>}
            </Tab.Screen>
            </Tab.Navigator>
        </>
    );
};


const MainTab = ({user}:{user:any}) => {
  
  const generateGravatarUrl = (email:string, size = 200) => {
    var MD5 = function(d:any){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d:any){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d:any){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d:any){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d:any,_:any){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d:any,_:any,m:any,f:any,r:any,i:any){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d:any,_:any,m:any,f:any,r:any,i:any,n:any){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d:any,_:any){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d:any,_:any){return d<<_|d>>>32-_}    
    const emailHash = MD5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${emailHash}?s=500&d=identicon`;
  };


  return (
    <View style={styles.tabContent}>
        <View style={styles.tabContent}>
      {user.username && (<><Image
        source={{uri: generateGravatarUrl(user.email)}}
        style={styles.profilePicture}
      />
    <Text style={styles.name}>{user.name}</Text>
    <Text style={styles.username}>@{user.username}</Text>
    <Text style={styles.gpa}>Community Service Hours: {user.hours}</Text>

      <View style={styles.aboutMe}>
      <ScrollView style={{flex: 1}}>
      <View style={{minWidth: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
      
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text>
          {user.about}
        </Text>
      
      </View>
      </ScrollView> 
      </View>
      </>)}
      </View>
    </View>
  );
};

const AcademicTab = ({ academic, schedule, creator_id, update, achievements }: {
  academic: Array<Activity> | [],
  schedule: Array<string> | [],
  creator_id: string,
  update: Function
  achievements: Array<String>,
}) => {

  return (
    <ScrollView style={styles.scheduleContainer}>
      <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Schedule</Text>

        <View>
          {schedule.length === 0 ? (
            <Text style={styles.errorMsg}>Nothing to see here...</Text>
          ) : (
            <View style={styles.table}>
              {/* Header row */}
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Period</Text>
                <Text style={styles.tableHeaderCell}>Class</Text>
              </View>
              {/* Schedule rows */}
              {schedule.map((x, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{`Period ${index + 1}`}</Text>
                  
                    <Text style={styles.tableCell}>{x}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
            <ActivitySection academic={academic} update={update} creator_id={creator_id} title='Academic' section_name='academic'/>
            <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>

        <View>
          {achievements.length === 0 ? (
            <Text style={styles.errorMsg}>Nothing to see here...</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Name</Text>
              </View>
              {achievements.map((x, index) => (
                <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{x}</Text>
            
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={{height: 100}}/>
    </ScrollView>
  );
};

const AthleticTab = ({athletic, update, creator_id}:{athletic: Array<Activity>, update: Function, creator_id: string}) => {
  return (
      <ScrollView style={styles.scheduleContainer}>
        <View style={styles.scheduleSection}>
          <ActivitySection academic={athletic} update={update} creator_id={creator_id} title='Athletic' section_name='athletic'/>
        </View>
      </ScrollView>
  );
};

const ClubsTab = ({club, update, creator_id, performing}:{club: Array<Activity>, update: Function, creator_id: string, performing:Array<Activity>}) => {

  return (
      <ScrollView style={styles.scheduleContainer}>
        <View style={styles.scheduleSection}>
          <ActivitySection academic={club} update={update} creator_id={creator_id} title='Clubs' section_name='club'/>
        </View>

        <View style={styles.scheduleSection}>
          <ActivitySection academic={performing} update={update} creator_id={creator_id} title='Performing Arts' section_name='performing'/>
        </View>

      <View style={{height: 100}}/>
      </ScrollView>
  );
};

const ActivitySection = ({ academic, update, creator_id, title, section_name}:{academic: Array<Activity>, update:Function, creator_id:string , title:string, section_name:string}) => {

  return (
    <View style={styles.academicSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
    <View>
        {academic.length === 0 ? (
          <Text style={styles.errorMsg}>Nothing to see here...</Text>
        ) : (
          <View>
            {academic.map((entry, index) => (
              <View style={styles.academicCard} key={index}>
                    <Text style={styles.cardTitle}>{entry.title}</Text>
                    <Text style={styles.cardDescription}>{entry.description}</Text>
                    <Text style={styles.cardDate}>Start Date: {entry.startedAt}</Text>
                    {entry.endedAt && (<Text style={styles.cardDate}>End Date: {entry.endedAt || '?'}</Text>)}
              </View>
            ))}
          </View>
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
    backgroundColor: "white",
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
