import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, Image, StatusBar, TextInput, KeyboardAvoidingView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FireSVC from '../FireSVC'
import {Ionicons} from '@expo/vector-icons';
import GroupCreation from '../components/GroupCreation';

const Group = ({groupName, groupUri, title, tags, openChat}) => (
    <View style={styles.documentContainer} key={groupName}>
      <View> 
        <Image 
            source={groupUri ? {uri: groupUri} : require('../assets/fitLogo.jpg')}
            style={[styles.avatar, {marginBottom: 6}]}
            />    
      </View>  
      <Text style={[styles.peopleText, {fontWeight: "bold"}]}> {groupName} </Text>
      <Text style={styles.peopleText}> {title} </Text>     
      <View style={styles.tagContainer}>{tags}</View>  
      <TouchableOpacity style={styles.chatButton} onPress={openChat}>
            <Ionicons name="ios-chatbubbles" size={18} color="white" style={{marginLeft: 8}}/>
            <Text style={styles.chatText}>Let's Talk!</Text>
      </TouchableOpacity>
    </View>
);


export default class GroupList extends React.Component {
    
    state = {
        groups: [
            {}
        ],
        tabIndex: 1,
        creatingGroup: false
    }

    componentDidMount() {
        console.log("mounted groups")
        this.unsubscribe = FireSVC.shared.firestore.collection('groups')
        .onSnapshot(async querySnapshot => {     
            var newGroupList = []     
            querySnapshot.forEach(group => newGroupList.push(group.data()));
            console.log(newGroupList);
            await this.setState({groups: newGroupList});
        });   
        
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    renderGroup = ({ item }) => {
        if(item !== null && item.tags !== undefined){
            var tagList = item.tags.map(tag => {return <View style = {styles.tag}><Text style={{fontSize: 12}} key={tag}>{tag}</Text></View>});
            return (
            <Group
                groupName={item.name}
                groupUri={item.uri}
                tags={tagList}
                openChat={() => this.openChat(item.name, item.uri)}
            />
            
            );
        }
    };

    renderGroups = () => {
        console.log("HERE")
        return (
            <View style={styles.tabContent}>
                <View style={{margin: 24}}/>
                <View>
                <View> 
                {this.state.groups.length > 0 ? (
                    <View>
                        <FlatList
                        contentContainerStyle={styles.myList}
                        data={this.state.groups}
                        renderItem={this.renderGroup}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(group) => group.name}
                    />
                    </View>) : <Text>Groups is empty</Text>}
                </View>
                </View>
            </View>
        )
    }

    openChat = async (chatID, chatImg) => {

        await FireSVC.shared.joinGroup(chatID).then((chatID) => {
            console.log("Chat: " + chatID)
            this.props.navigation.navigate("GroupChat", {chat: {id: chatID, chatImg: chatImg}})
        });
        /*
        .then((chatID) => {
            console.log("Chat: " + chatID)
            this.props.navigation.navigate("Chat", {chat: {id: chatID, chatImg: avatar, users: [{displayName: displayName, uid: uid}, FireSVC.shared.user]}})
        });
        */
    }

    createGroup = () => {
        console.log("Creating Group");
        this.setState({creatingGroup: true})
    }

    closeGroupCreation = () => {
        this.setState({creatingGroup: false})
    }
    
    render() {
        return (
            <View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.ionContainer} onPress={this.createGroup}>
                        <Ionicons name="md-add" size={24} style={styles.ionbuttons}/>
                    </TouchableOpacity>               
                </View>
                <KeyboardAvoidingView style={styles.popUp}>
                    {this.state.creatingGroup ? <GroupCreation closeHandler={this.closeGroupCreation} /> : null}
                </KeyboardAvoidingView>
                <View>
                    {this.renderGroups()}
                </View>               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    popUp: {
        justifyContent: 'flex-end',
        alignSelf: "center",
    },
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
        position: "absolute",
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
