import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, StatusBar, TouchableOpacity, Image, FlatList, LayoutAnimation, KeyboardAvoidingView} from 'react-native'
import FireSVC from '../FireSVC';
import {Ionicons} from '@expo/vector-icons';
import UserPermissions from '../utilities/UserPermissions'
import * as ImagePicker from 'expo-image-picker'
import * as firebase from "firebase"
import EditInterests from '../components/EditInterests'

const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={styles.option}>
      <Text style={styles.optionText}>{item.interest}</Text>
    </TouchableOpacity>
);

export default class ConnectScreen extends React.Component {

    state = {
        uid: "",
        user: {},
        avatar: null,
        editingInterests: false
    };

    unsubscribe = null;

    componentDidMount() {
        console.log("Mounted");
        //this.loadPrevious();

        const user = FireSVC.shared.user.uid
        console.log(user);
        this.unsubscribe = FireSVC.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ user: doc.data() });
                console.log(this.state.user);
            });
            
    }

    renderItem = ({ item }) => {
        //const backgroundColor = "#6e3b6e" ;
        //console.log(item);
        return (
          <Item
            item={item}           
          />
        );
    };

    renderTags = () => {
        console.log("tag")
        if(this.state.user) {
            console.log("HERE")
            return this.state.user.interests.map(interest => {return <View style = {styles.option}><Text style={styles.optionText} key={interest.interest}>{interest.interest}</Text></View>});
        } else {
            console.log("NO TAGS")
            return <Text> No tags </Text>
        }
       
    }

    signOutUser = () => {
        firebase.auth().signOut();
    }

    handlePickAvatar = async () => {
        UserPermissions.getCameraPermissions()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowEditing: true,
            aspect: [4, 3]
        })

        if (!result.cancelled) {
            FireSVC.shared.updateUserProfileImage(result.uri);
        }

        console.log("Profile Image Set")

        
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    loadPrevious = async () => {
        const {uid} = this.props.navigation.state.params.uid;
        await this.setState({uid});
        console.log(this.state)
    }

    openChat = async () => {
        console.log("User: " + FireSVC.shared.user.displayName)

        FireSVC.shared.createChatWithUser(this.state.user.uid, this.state.user.displayName).then((chatID) => {
            console.log("Chat: " + chatID)
            this.props.navigation.navigate("Chat", {chat: {id: chatID, users: [{displayName: this.state.user.displayName, uid: this.state.user.uid}, FireSVC.shared.user]}})
        });
    }

    interestList = () => {
        return (this.state.user.interests) ? this.state.user.interests.map(interest => {return <View key={interest.interest} style = {styles.option}><Text style={{fontSize: 12}} key={interest.interest}>{interest.interest}</Text></View>}) : <Text>No interests</Text>; }

    fieldsList = () => {
        return (this.state.user.fields) ? this.state.user.fields.map(field => {return <View key={field.field} style = {styles.option}><Text style={{fontSize: 12}} key={field.field}>{field.field}</Text></View>}) : <Text>No interests</Text>; }

    EditInterests = () => {
        console.log("Editing Profile");
        this.setState({editingInterests: true})
    }

    closeEditInterests = () => {
        this.setState({editingInterests: false})
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>

                <View style={{marginVertical: 25, backgroundColor:"red"}}>

                    <View style={styles.progressBar}>
                        <View style={styles.progress}></View>
                    </View>                
                </View>          

                <View style={styles.peopleContainer}>
                <TouchableOpacity onPress={() => {this.handlePickAvatar()}}> 
                    <Image 
                        source={(this.state.user.avatar) ? {uri: this.state.user.avatar} : require("../assets/fitLogo.jpg")}
                        style={styles.avatar}
                        />    
                </TouchableOpacity>  
                <TouchableOpacity>
                    <Text style={[{fontSize: 14, fontWeight: "bold", marginTop: 10}]}> {this.state.user.displayName} </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.peopleText}> {this.state.user.title} </Text>
                </TouchableOpacity>
                </View>

                <TouchableOpacity>
                    <Text style={styles.aboutText}> {this.state.user.about} </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tagContainer} onPress={this.EditInterests} >{this.interestList()}</TouchableOpacity>  

                <TouchableOpacity style={styles.tagContainer}>{this.fieldsList()}</TouchableOpacity>  

                <TouchableOpacity style={[styles.logOut, {margin: 20}]} onPress={() => this.signOutUser()}>
                    <Text style={{color: "white"}}>Sign out</Text>
                    <View style={{marginLeft: 10}}>                 
                        <Ionicons name="ios-log-out" size={20} color="white"></Ionicons>
                    </View>
                </TouchableOpacity>

                <View style={styles.popUp}>
                    {this.state.editingInterests ? <EditInterests interests={this.state.user.interests} closeHandler={this.closeEditInterests} /> : null}
                </View>


            </View>
        ); 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    popUp: {
        justifyContent: 'flex-end',
        alignSelf: "center",
    },
    header: {
        height: 62,
        width: "100%",
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    
    headerTitle: {
        margin: 32,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center"
    },
    fullContainer: {
        marginHorizontal: 30,
        marginVertical: 10,
        backgroundColor: "#f6f6f6",
        borderRadius: 5,
        height: 200,
        alignItems: "center",
        justifyContent: "center"
    },
    SplitContainer: {
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row',
        marginHorizontal: 30,
        marginVertical: 10,
        backgroundColor: "#f6f6f6",
        borderRadius: 5,
        height: 200,
        alignItems: "center",
        justifyContent: "center"
    },
    halfContainer: {
        position: "relative",
        backgroundColor: "white",
        width: "40%",
        height: "100%",
        borderRadius: 5,
        right: 0  
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
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    peopleText: {
        fontSize: 12,
        textAlign: "center"
    },
    peopleContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 15
    }, headerContainer: {
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //alignContent: "space-between"
    },
    logOut: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DC143C",
        alignSelf: "center",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5
    },
    aboutText: {
        fontSize: 12,
        fontStyle: "italic",
        textAlign: "center",
        marginVertical: 20,

    },
    option: {
        backgroundColor: "#DFE0DF",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 5 
    },
    optionText: {
        fontSize: 12
    },
});
