import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, StatusBar, TextInput, FlatList, SafeAreaView, Dimensions, LayoutAnimation, Image} from 'react-native'
import * as firebase from 'firebase'; 
import FireSVC from '../FireSVC';
import { HeaderTitle } from 'react-navigation-stack';
import {Ionicons} from '@expo/vector-icons';
import Fire from '../FireSVC';

    const ChatPreview = ({chatInfo, openChat, font, dateString}) => (
        <View>
            <TouchableOpacity onPress={openChat}>
                <View style={styles.chatContainer}>                   
                    <View style={styles.userPortrait}>
                        <View> 
                            <Image 
                                source={(chatInfo.avatar) ? {uri: chatInfo.avatar} : require("../assets/fitLogo.jpg")}
                                style={styles.avatar}
                                />    
                        </View> 
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userNameText, font]}>{chatInfo.id} </Text>
                        <View style={styles.messageContainer}>
                            <Text numberOfLines={1} style={[styles.message, font]}> 
                                {chatInfo.latestMsg.length < 40 ? (chatInfo.latestMsg) : 
                                    (chatInfo.latestMsg.substring(0, 50) + "...")} 
                            </Text>
                            <Text style={[styles.timeStamp, font]}> {dateString} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )

    export default class GroupChatList extends React.Component {

        constructor() {
            super();
            this.state = {  
                tabIndex: 1,  
                searchText: "Search here",
                chatList: [
                    {
                        id: "adsgadsgfdsafdsaf",
                        names: [ "Test Phetsomphou","Test Phetsomphou" ],
                        latestMsg: "Havent loaded Messages",
                        date: new Date()
                    },
                ],
                Filter: []

            }

    
        }

    openChat = (chat_room) => {
        this.props.navigation.navigate("GroupChat",  {chat: {id: chat_room.id, chatImg: chat_room.avatar}})
    }

    getDateString = (date) => {
        if(date.toLocaleDateString("en-US") === new Date().toLocaleDateString("en-US")){
            console.log("dateconvertor HERE: " + date.toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric"}))
            return date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        } else {
            console.log("dateconvertor hURR")
            return date.toLocaleDateString("en-US");
        }
    }

    componentDidMount(){
        console.log("Mounted Group List");
        //this.loadChats();
        this.unsubscribe = FireSVC.shared.firestore.collection('groups')   
        .where('users', 'array-contains', {displayName: FireSVC.shared.user.displayName, uid: FireSVC.shared.user.uid})
        
        .onSnapshot(async querySnapshot => {          
            console.log("here")
            var chats = []
            querySnapshot.forEach(doc => {
                var data = doc.data();
                var chatID = data.name;
                var avatar = data.uri;
                var dateF = data.latestMsg.date;
                var date = dateF.toDate();

                console.log("found some het: " + chatID)

                var chat = {
                    id: chatID,
                    users: data.users,
                    latestMsg: data.latestMsg.text,
                    seen: data.seen,
                    date: date,
                    avatar: avatar 
                }

                        //console.log("ChatAva: " + chat.avatar);
                chats.push(chat); 
                chats.sort((a , b) => (a.date < b.date) ? 1 : -1);
                this.setState({chatList: chats})
                this.setState({Filter: chats})

                    
                
            }) 

            console.log("chats: " + chats);       
        }); 
    }



    componentWillUnmount(){
        console.log("Unmounted Private Chat List")
        this.unsubscribe();
    }

    renderChat = ({ item }) => {
        const font = ( item.seen ? {fontWeight: "200"} : {fontWeight: "bold"} );
        var dateString = this.getDateString(item.date)
        //console.log(item);
        return (
          <ChatPreview
            chatInfo={item}
            openChat={() => this.openChat(item)}
            font={font}
            dateString={dateString}
          />
        );
      };
      
    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            
            <View>
                
                <StatusBar barStyle="light-content"></StatusBar>

                <View style={styles.contentContainer}>
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="ios-search" size={24} style={{marginHorizontal: 10}}/>
                        <TextInput 
                            style={styles.searchBar}
                            placeholder="Search chats"
                            placeholderTextColor="grey"
                            onChangeText={(text) => {
                                if(text === ""){
                                    console.log("fILTERING")
                                    this.setState({Filter: this.state.chatList})
                                } else {
                                    console.log("fILTERING")
                                    var a = this.state.chatList
                                    var b = a.filter(chat => { return chat.id.toString().toUpperCase().includes(text.toUpperCase()) })
                                    console.log(b);
                                    this.setState({Filter: b});
                                } 
                            }}                   
                        >
                            
                        </TextInput>
                    </View>

                    <View>
                        <FlatList
                            data={this.state.Filter}
                            contentContainerStyle={styles.myList}
                            renderItem={this.renderChat}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(chat) => chat.docID}
                        />
                    </View>
                </View>
                
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        fontWeight: "200",
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
    contentContainer: {
        marginHorizontal: 12
    },
    searchBarContainer: {
        flexDirection: "row",
        backgroundColor: "#FCFAFA",
        borderRadius: 50,
        marginHorizontal: 10,
        alignContent: "center",
        padding: 5,
        marginTop: 15,
        marginBottom: 5,
        height: 35,
    },
    searchBar: {
        //backgroundColor: "red",
        width: "90%"
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
    myList: {
        paddingBottom: 475
    }
});
    
