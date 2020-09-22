import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, Image, StatusBar, TextInput} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FireSVC from '../FireSVC'
import {Ionicons} from '@expo/vector-icons';
import PeopleList from '../components/PeopleList';
import GroupList from '../components/GroupList';

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

export default class FitScreen extends React.Component {
    
    state = {
        users: [
            {}
        ],
        tabIndex: 1
    }

    
    renderUser = ({ item }) => {
        //const backgroundColor = "#6e3b6e" ;
        //https://firebasestorage.googleapis.com/v0/b/test-project-3b438.appspot.com/o/avatars%2Fovwko7g4JHXVP2NNUijT03DFiPl2?alt=media&token=7bd2550f-8c52-4baf-9c00-7c099ca25bf7
        //let avatarUri = ( (item.avatar !== (null || undefined)) ? item.avatar: '../assets/fitLogo.jpg');
        if(item !== null){
            return (
            <Item
                userName={item.displayName}
                avatarUri={item.avatar}
                title={item.title}
                user={item}
            />
            );
        }
    };

    renderContent = () => {
        console.log("HERE")
        if(this.state.tabIndex == 0){
            return this.renderGroups();
        }
        else if(this.state.tabIndex == 1) {
            return this.renderPeople();
        }
    }

    renderGroups = () => {
        console.log("HERE GROUP")
        return (
            <GroupList navigation={this.props.navigation}/>
            
        )
    }

    renderPeople = () => {
        console.log("HERE")
        return (
            <PeopleList navigation={this.props.navigation}/>
        )
    }

    render() {
        return (
            <View>
                <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#4A37DE"/>

                <View style={styles.headerContainer}>       
                    <Text style={styles.header}> Fits </Text>     
                    <View style={styles.tabs}>
                        <TouchableOpacity onPress={() => this.setState({tabIndex: 0})} style={(this.state.tabIndex == 0) ? styles.selectedTab : styles.tab}>
                            <Text style={(this.state.tabIndex == 0) ? styles.selectedTabText : styles.tabText}>Groups</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({tabIndex: 1})} style={[styles.tab, (this.state.tabIndex == 1) ? styles.selectedTab : styles.tab ]}>
                            <Text style={(this.state.tabIndex == 1) ? styles.selectedTabText : styles.tabText} >People</Text>
                        </TouchableOpacity>
                    </View>             
                </View>

                <View>
                    {this.renderContent()}
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
        height: 350,
        width: 250,
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
