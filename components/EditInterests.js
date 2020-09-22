import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator, ListView, TouchableOpacity, Image, StatusBar, TextInput, Modal, KeyboardAvoidingView, ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import FireSVC from '../FireSVC'
import {Ionicons} from '@expo/vector-icons';
import UserPermissions from '../utilities/UserPermissions'
import * as ImagePicker from 'expo-image-picker'

export default class EditInterests extends React.Component {
    
    state = {
        tags: [],
        tag: null,
    }

    componentDidMount() {  
       this.loadComponents();
    }

    
    loadComponents = async () => {
        this.setState({
            tags: this.props.interests,
        });

        console.log("Tags" + this.state.tags);
    }

    removeInterest = (item) => {
        console.log(item)
        var filtered = this.state.tags.filter(i => i.interest !== item.interest);

        this.setState({tags: filtered});
        console.log(this.state.tags)
        console.log("removed: " + item.interest);
    }
    

    componentWillUnmount(){
    }


    addTag = (tag) => {
        var tagsCopy = this.state.tags;
        tagsCopy.push({interest: tag});
        this.setState({ tags: tagsCopy })
        console.log(this.state.tags)
    }

    renderTags = () => {
        var tagList = this.state.tags.map(tag => {return <TouchableOpacity key={tag.interest} onPress={() => this.removeInterest(tag)} style = {styles.tag}><Text style={{fontSize: 16}} key={tag.interest}>{tag.interest}</Text></TouchableOpacity>});
        return <View style={styles.tagContainer}>{tagList}</View>
    }

    updateInterests = async () => {
        console.log("Creating Group")
        await FireSVC.shared.updateInterests(this.state.tags);
        this.props.closeHandler();
    }

    render() {
        
        return (
                <Modal transparent={true} animationType="slide">
                    <View style={styles.container}>
                        <ScrollView>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={this.props.closeHandler}><Text style={styles.fontClickables}>Cancel</Text></TouchableOpacity>  
                                <Text style={styles.fontTitle}>Interests</Text>
                                <TouchableOpacity onPress={this.updateInterests}><Text style={styles.fontClickables}>Update</Text></TouchableOpacity>  
                            </View>
                            
                            <TextInput
                                style={styles.inputs}
                                placeholder="Tags"
                                value={this.state.tag}
                                onChangeText={text => this.setState({tag: text})}
                                onSubmitEditing={(value) => this.addTag(this.state.tag)}  
                            />

                            {this.renderTags()}                          

                        </ScrollView>
                    </View>
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