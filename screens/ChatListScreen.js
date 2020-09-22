import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, StatusBar, TextInput, FlatList, SafeAreaView, Dimensions, LayoutAnimation, Image} from 'react-native'
import * as firebase from 'firebase'; 
import FireSVC from '../FireSVC';
import { HeaderTitle } from 'react-navigation-stack';
import {Ionicons} from '@expo/vector-icons';
import Fire from '../FireSVC';
import PrivateChatList from '../components/PrivateChatList'
import GroupChatList from '../components/GroupChatList'

    export default class ChatListScreen extends React.Component {

        constructor() {
            super();
            this.state = {  
                tabIndex: 1,  
            }

    
        }

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            
            <View>
                
                <StatusBar barStyle="light-content"></StatusBar>

                <View style={styles.headerContainer}>       
                    <Text style={styles.header}> Chats </Text>     
                    <View style={styles.tabs}>
                        <TouchableOpacity onPress={() => this.setState({tabIndex: 0})} style={(this.state.tabIndex == 0) ? styles.selectedTab : styles.tab}>
                            <Text style={(this.state.tabIndex == 0) ? styles.selectedTabText : styles.tabText}>Groups</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({tabIndex: 1})} style={[styles.tab, (this.state.tabIndex == 1) ? styles.selectedTab : styles.tab ]}>
                            <Text style={(this.state.tabIndex == 1) ? styles.selectedTabText : styles.tabText} >People</Text>
                        </TouchableOpacity>
                    </View>             
                </View>

                {(this.state.tabIndex === 1) ? <PrivateChatList navigation={this.props.navigation}/> : <GroupChatList navigation={this.props.navigation}/>}
                
                
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
});
    
