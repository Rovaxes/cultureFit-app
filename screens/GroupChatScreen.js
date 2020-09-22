import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, StatusBar, LayoutAnimation, TouchableOpacity, Platform, KeyboardAvoidingView, SafeAreaView, Image} from 'react-native'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import * as firebase from 'firebase'; 
import {Ionicons} from '@expo/vector-icons';
import FireSVC from "../FireSVC.js"
import Fire from '../FireSVC.js';

export default class GroupChatScreen extends React.Component {
    
    state = {
        id: "",
        chatImg: null,
        giftedMessages: []
    }

    
    get giftedUser() {
        return {
            _id: Fire.shared.uid,
            name: FireSVC.shared.user.displayName,           
            avatar: FireSVC.shared.user.photoURL
        }
    }


    componentDidMount(){
        console.log("Mounted GroupChatRoom");
        this.loadRoom();       
    }

    loadRoom = async () => {
        await this.setState({
            id: this.props.navigation.state.params.chat.id,
            chatImg: this.props.navigation.state.params.chat.chatImg
        });
        
        console.log(this.state);
        
        FireSVC.shared.get(message => {
            this.setState(previous => ({
                messages: GiftedChat.append(previous.messages, message)
                }));
            FireSVC.shared.updateSeenGroup(this.state.id);
        
            }
            , this.state.id);  

        console.log("Got chat")  
        
    }

    renderNames = () => {
        return this.state.id;
    }

    componentWillUnmount() {
        FireSVC.shared.off();
    }

    handleSend(messages, id) {
        //FireSVC.shared.handleSend(messages,id);
        FireSVC.shared.sendGroup(messages, id)
    }

    renderBubble = props => {    
        return (
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: 'white'
              }
            }}
            wrapperStyle={{
              right: {
              }
            }}
          />
        )
      }

    render() {
        LayoutAnimation.easeInEaseOut();
        const chat = 
        <GiftedChat 
            messages={this.state.messages} 
            onSend={(messages) => this.handleSend(messages, this.state.id)}
            user={this.giftedUser}
        />

        return (
            
                <View style={{flex: 1}} behavior="padding" keyboardVerticalOffset={10} enabled>  
                    
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate("Chats")} >  
                            <Ionicons name="ios-arrow-back" size={40} color="black"></Ionicons>
                        </TouchableOpacity>
                        <View style={{marginHorizontal: 5}}> 
                            <Image 
                                source={(this.state.chatImg) ? {uri: this.state.chatImg} : require("../assets/fitLogo.jpg")}
                                style={styles.avatar}
                                />    
                        </View> 
                        <Text style={styles.chatName}> {this.renderNames()} </Text>                      
                    </View>

                    <GiftedChat 
                    messages={this.state.messages} 
                    onSend={(messages) => this.handleSend(messages, this.state.id)}
                    user={this.giftedUser}
                    renderBubble={this.renderBubble}
                    />

                </View>


            
        )
    }
    /*
    render() {
        const chat = 
        <GiftedChat 
            messages={this.state.messages} 
            onSend={Fire.shared.send}
            user={this.user}
        />;

        if (Platform.OS === 'android'){
            return <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={30} enabled>
                {chat}
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Message")} >  
                    <Text>Back: {this.state.docID}</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        }

        return <SafeAreaView style={{flex: 1}}>
            {chat}
        </SafeAreaView>;

    }
    */
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    headerContainer: {
        //justifyContent: "center",
        alignItems: "center",
        height: 80,
        //backgroundColor: "#11AF60",
        borderBottomWidth: 4,
        borderColor: "#4A37DE",
        marginTop: 10,
        flexDirection: "row"
    },
    chatName: {
        fontSize: 28
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    back: {
        marginHorizontal: 20
    }
});