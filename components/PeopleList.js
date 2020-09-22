import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, Image, StatusBar, TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FireSVC from '../FireSVC'
import {Ionicons} from '@expo/vector-icons';
import Fire from '../FireSVC';


const Person = ({userName, avatarUri, title, interests, openChat}) => (
    <View style={styles.documentContainer} key={userName}>
      <View> 
        <Image 
            source={avatarUri ? {uri: avatarUri} : require('../assets/fitLogo.jpg')}
            style={[styles.avatar, {marginBottom: 6}]}
            />    
      </View>  
      <Text style={[styles.peopleText, {fontWeight: "bold"}]}> {userName} </Text>
      <Text style={styles.peopleText}> {title} </Text>     
      <View style={styles.tagContainer}>{interests}</View>  
      <TouchableOpacity style={styles.chatButton} onPress={openChat}>
            <Ionicons name="ios-chatbubbles" size={18} color="white" style={{marginLeft: 8}}/>
            <Text style={styles.chatText}>Let's Talk!</Text>
      </TouchableOpacity>
    </View>
);

export default class PeopleList extends React.Component {
    
    state = {
        users: [
            {}
        ],
        tabIndex: 1,
        interests: []
    }

    componentDidMount() {

        /*
        Fire.shared.firestore.collection('users').doc(Fire.shared.uid).get().then(async doc => {
            var interests = doc.data().interests;
            this.setState({interests});
            console.log("YOO: " + interests)
        }       
        )

        this.unsubscribe = FireSVC.shared.firestore.collection('users').where("interests", "array-contains-any", (this.state.interests.length > 0) ? this.state.interests : [{}])
        .onSnapshot(async querySnapshot => {     
            var newUsersList = []     
            querySnapshot.forEach(user => newUsersList.push(user.data()));
            console.log(newUsersList);
            await this.setState({users: newUsersList});
        });   */
        this.loadInterests();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    loadInterests = async () => {
        this.unsubscribe = Fire.shared.firestore.collection('users').doc(Fire.shared.uid).onSnapshot(async doc => {
            var interests = doc.data().interests;
            this.setState({interests});
            console.log("YOO: " + interests)
            FireSVC.shared.firestore.collection('users').where("interests", "array-contains-any", (this.state.interests.length > 0) ? this.state.interests : [])
            .onSnapshot(async querySnapshot => {     
                var newUsersList = []     
                querySnapshot.forEach(user => (user.data().uid !== FireSVC.shared.user.uid) ? newUsersList.push(user.data()) : console.log("Hey thats me"));
                console.log(newUsersList);
                await this.setState({users: newUsersList});
            }); 
        }       
        )
    }

    containsObj = (interest) => {
        if (this.state.interests.some(obj => obj.interest === interest)) {
            return true;
        } else {
            return false
        }
    }

    renderPerson = ({ item }) => {
        //const backgroundColor = "#6e3b6e" ;
        //https://firebasestorage.googleapis.com/v0/b/test-project-3b438.appspot.com/o/avatars%2Fovwko7g4JHXVP2NNUijT03DFiPl2?alt=media&token=7bd2550f-8c52-4baf-9c00-7c099ca25bf7
        //let avatarUri = ( (item.avatar !== (null || undefined)) ? item.avatar: '../assets/fitLogo.jpg');

        console.log("IV: " + item.interests);
        console.log("PE: " + this.state.interests);
        //var interestList = item.interests.map(interest => {return <Text key={interest.name}>{interest.name}</Text>});
        //console.log(interestList);
        if(item !== null && item.interests !== undefined && this.state.users !== undefined){
            var interestList = item.interests.map(interest => {return <View style = {(this.containsObj(interest.interest)) ? styles.matchedTag : styles.tag}><Text style={{fontSize: 12}} key={interest.interest}>{interest.interest}</Text></View>});
            return (
            <Person
                userName={item.displayName}
                avatarUri={item.avatar}
                title={item.title}
                interests={interestList}
                openChat={() => this.openChat(item.uid, item.displayName, item.avatar)}
            />
            );
        }
    };

    renderPeople = () => {
        console.log("HERE")
        return (
            <View style={styles.tabContent}>
                <View style={{margin: 24}}/>
                <View>
                <View> 
                {this.state.users.length > 0 ? (
                    <View>
                    <FlatList
                        contentContainerStyle={styles.myList}
                        data={this.state.users}
                        renderItem={this.renderPerson}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(user) => user.uid}
                    />
                    </View>) : <Text>Users is empty</Text>}
                </View>
                </View>
            </View>
        )
    }

    openChat = async (uid, displayName, avatar) => {

        FireSVC.shared.createChatWithUser(uid, displayName).then((chatID) => {
            console.log("Chat: " + chatID)
            this.props.navigation.navigate("Chat", {chat: {id: chatID, chatImg: avatar, users: [{displayName: displayName, uid: uid}, FireSVC.shared.user]}})
        });
    }

    render() {
        return (
            <View>
                <View>
                    {this.renderPeople()}
                </View>               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    peopleText: {
        fontSize: 14,
        textAlign: "center"
    },
    peopleContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 15
    },   headerContainer: {
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //alignContent: "space-between"
    },
    header: {
        fontWeight: "500",
        fontSize: 32,
        margin: 15,
        color: "white"        
    },    
    headerContainer: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center", 
        backgroundColor: "#4A37DE",   
    },
    tabs: {
        flexDirection: "row",
        alignSelf: "center",
    },
    tab: {
        width: "50%",
        //backgroundColor: "red",
        alignItems: "center",
        marginVertical: 10
    },
    tabText: {
        fontSize: 20,
        color: "#9B9B9B"
    },
    selectedTab: {
        width: "50%",
        alignItems: "center",
        marginVertical: 10,
        //backgroundColor: "red",
    },
    selectedTabText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    },
    documentContainer: {
        height: 375,
        width: 275,
        //backgroundColor: "blue",
        margin: 10,
        borderColor: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    tagContainer: {
        //backgroundColor: "red",
        width: "75%",
        flexDirection: "row",
        marginVertical: 10,
        alignSelf: "center",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    tag: {
        backgroundColor: "#DFE0DF",
        borderRadius: 5,
        margin: 2,
        paddingHorizontal: 5,
        paddingVertical: 1       
    },
    matchedTag: {
        backgroundColor: "lightblue",
        borderRadius: 5,
        margin: 2,
        paddingHorizontal: 5,
        paddingVertical: 1      
    },
    ionContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4A37DE",
        margin: 5

    },
    ionbuttons: {
        color: "white",
    },
    buttonContainer: {
        width: 50,
        height: 50,
        borderColor: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    myList: {
        paddingHorizontal: 55
    },
    chatButton: {
        flexDirection: "row",
        backgroundColor: "#4A37DE",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        borderRadius: 4,
        marginVertical: 15
    },
    chatText: {
        color: "white",
        marginHorizontal: 8,
        fontSize: 10
    }
});
