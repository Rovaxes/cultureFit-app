import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, Image, StatusBar, TextInput, Modal, KeyboardAvoidingView, ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FireSVC from '../FireSVC'
import {Ionicons} from '@expo/vector-icons';
import UserPermissions from '../utilities/UserPermissions'
import * as ImagePicker from 'expo-image-picker'

export default class GroupCreation extends React.Component {
    
    state = {
        groups: [
            {}
        ],
        tabIndex: 1,
        avatar: null,
        tags: [],
        tag: null,
        name: null,
        description: null,
        participants: []
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

    addTag = (tag) => {
        var tagsCopy = this.state.tags;
        tagsCopy.push(tag);
        this.setState({ tags: tagsCopy })
        console.log(this.state.tags)
    }

    handlePickAvatar = async () => {
        UserPermissions.getCameraPermissions()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowEditing: true,
            aspect: [4, 3]
        })

        if (!result.cancelled) {
            this.setState({ avatar: result.uri })
        }
        console.log(this.state.avatar)
    }

    renderTags = () => {
        var tagList = this.state.tags.map(tag => {return <View style = {styles.tag}><Text style={{fontSize: 16}} key={tag}>{tag}</Text></View>});
        return <View style={styles.tagContainer}>{tagList}</View>
    }

    createGroup = () => {
        console.log("Creating Group")
        FireSVC.shared.createGroup(this.state.name, this.state.avatar, this.state.description, this.state.tags);
    }

    render() {
        return (
                <Modal transparent={true} animationType="slide">
                    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
                        <ScrollView>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={this.props.closeHandler}><Text style={styles.fontClickables}>Cancel</Text></TouchableOpacity>  
                                <Text style={styles.fontTitle}>New Group</Text>
                                <TouchableOpacity onPress={this.createGroup}><Text style={styles.fontClickables}>Create</Text></TouchableOpacity>  
                            </View>

                            <TouchableOpacity style={{alignItems: "center"}} onPress={this.handlePickAvatar}> 
                            
                                {(this.state.avatar === null) ?
                                    (<View style={styles.profilePic}>                       
                                        <Ionicons name="ios-camera" size={42} color="black"></Ionicons>                                        
                                    </View>) : <Image source={{uri: this.state.avatar}} style={styles.profilePic}></Image>
                                }

                                <Text style={{margin: 10, fontSize: 16, color: "#404040"}}>Add Photo</Text>   
                            </TouchableOpacity>   
                            
                            <TextInput
                                style={styles.inputs}
                                placeholder="Group name"
                                onChangeText={text => this.setState({name: text})}
                            />   

                            <TextInput
                                style={styles.inputs}
                                placeholder="Description"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                onChangeText={text => this.setState({description: text})}
                            />   

                            <TextInput
                                style={styles.inputs}
                                placeholder="Tags"
                                value={this.state.tag}
                                onChangeText={text => this.setState({tag: text})}
                                onSubmitEditing={(value) => this.addTag(this.state.tag)}  
                            />

                            {this.renderTags()}

                            <TouchableOpacity style={{marginHorizontal: 30}} onPress={this.createGroup}><Text style={[styles.fontClickables, {fontSize: 16}]}>Add participants</Text></TouchableOpacity>  

                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        //justifySelf: "center",
        backgroundColor: "white",       
        width: "100%",
        height: "98%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    header: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
        backgroundColor: "#F9F9F9F0",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",

    },
    fontClickables: {
        fontSize: 18,
        color: "#007AFF"
    },
    fontTitle: {
        fontSize: 18
    },
    profilePic: {
        borderColor: "#707070",
        borderWidth: 1,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        height: 80,
        width: 80,
        borderRadius: 40,
        marginTop: 30
    },
    inputs: {
        marginVertical: 10,
        marginHorizontal: 30,
        borderWidth: 0.5,
        borderColor: "#707070",
        padding: 2,
        paddingHorizontal: 10,
        fontSize: 16
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


})