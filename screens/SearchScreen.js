import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, Image, StatusBar, TextInput, LayoutAnimation} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FireSVC from '../FireSVC'
import {Ionicons} from '@expo/vector-icons';


const Person = ({userName, avatarUri, title, interests, openChat}) => (
    <TouchableOpacity style={styles.chatContainer} key={userName} onPress={openChat}>
      <View style={styles.userPortrait}>
            <View> 
                <Image 
                    source={(avatarUri) ? {uri: avatarUri} : require("../assets/fitLogo.jpg")}
                    style={styles.avatar}
                    />    
            </View> 
        </View>

        <View style={styles.userInfo}>
            <Text style={[styles.userNameText]}>{userName} </Text>
                <View style={styles.messageContainer}> 
                <View style={styles.tagContainer}>{interests}</View>  
                </View>
        </View>  
    </TouchableOpacity>
);

export default class SearchScreen extends React.Component {
    
    state = {
        users: [
            {}
        ],
        tabIndex: 1,
        interests: [],
        Filter: []
    }

    componentDidMount() {
        this.loadInterests();
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    loadInterests = async () => {
        this.unsubscribe = 
            FireSVC.shared.firestore.collection('users')
            .onSnapshot(async querySnapshot => {     
                var newUsersList = []     
                querySnapshot.forEach(user => (user.data().uid !== FireSVC.shared.user.uid) ? newUsersList.push(user.data()) : console.log("Hey thats me"));
                console.log(newUsersList);
                await this.setState({users: newUsersList});
                await this.setState({Filter: newUsersList});
            }); 
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
                openChat={() => this.openChat(item.uid)}
            />
            );
        }
    };

    renderPeople = () => {
        console.log("HERE")
        return (
            <View style={styles.tabContent}>
                <View>
                <View> 
                {this.state.users.length > 0 ? (
                    <View>
                    <FlatList
                        contentContainerStyle={styles.myList}
                        data={this.state.Filter}
                        renderItem={this.renderPerson}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(user) => user.uid}
                    />
                    </View>) : <Text>Users is empty</Text>}
                </View>
                </View>
            </View>
        )
    }

    openChat = async (uid) => {
        console.log(uid)
        this.props.navigation.navigate("ViewProfile", {id: uid})
    }
    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            
            <View>
                
                <StatusBar barStyle="light-content"></StatusBar>

                <View style={styles.headerContainer}>                 
                    <Text style={styles.header}> Search </Text>  

                    <View style={styles.searchBarContainer}>
                        <Ionicons name="ios-search" size={24} style={{marginHorizontal: 10}}/>
                        <TextInput 
                            style={styles.searchBar}
                            placeholder="Search for people"
                            placeholderTextColor="grey"
                            onChangeText={(text) => {
                                if(text === ""){
                                    console.log("fILTERING")
                                    this.setState({Filter: this.state.users})
                                } else {
                                    console.log("fILTERING")
                                    var a = this.state.users
                                    var b = a.filter(user => { return user.displayName.toString().toUpperCase().includes(text.toUpperCase()) })
                                    console.log(b);
                                    this.setState({Filter: b});
                                } 
                            }}                   
                        >                           
                        </TextInput>
                    </View>                
                </View>

                <View>
                    {this.renderPeople()}
                </View>
                
                
            </View>
        )

    }    
}
    

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4A37DE"
        //alignContent: "space-between"
    },
    header: {
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
        justifyContent: "center",
        fontWeight: "500",
        fontSize: 32,
        color: "white"        
    },
    contentContainer: {
        marginHorizontal: 12
    },
    personContainer: {
        flexDirection: "row"
    },
    searchBarContainer: {
        flexDirection: "row",
        backgroundColor: "#FCFAFA",
        borderRadius: 50,
        marginHorizontal: 10,
        alignContent: "center",
        padding: 2.5,
        marginTop: 17,
        marginBottom: 20,
        height: 30,
    },
    searchBar: {
        //backgroundColor: "red",
        width: "80%"
    },
    chatContainer: {
        //backgroundColor: "red",
        //justifyContent: "center",
        alignContent: "center",
        flexDirection: "row",
        //backgroundColor: "orange",
        //height: 100
    },
    userPortrait: {
        //margin: 20,
        //backgroundColor: "red",
        marginLeft: "2.5%",
        marginRight: "5%",
        alignItems: "center",
        justifyContent: "center",
        width: "17.5%",
        height: 100
    },
    userInfo: {
        //backgroundColor: "blue",
        width: "72.5%",
        marginRight: "2.5%",
        justifyContent: "center"
    },
    userNameText: {
        fontSize: 24
    },
    messageContainer: {
        //backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    message: {
       
    },
    timeStamp: {},
    container: {
        //flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        marginBottom: 75
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        height: 200,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    container: {
        height: "100%"
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    tagContainer: {
        //backgroundColor: "red",
        width: "75%",
        flexDirection: "row",
        marginVertical: 10,
        alignSelf: "center",
        alignItems: "center",
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
    myList: {
        paddingBottom: 275
    },
    tabContent: {}
});
    
