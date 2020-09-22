import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, LayoutAnimation} from 'react-native'
import * as firebase from 'firebase'

export default class HomeScreen extends React.Component {
    state = {
        email: "",
        displayName: ""
    }

    componentDidMount() {
        const {email, displayName} = firebase.auth().currentUser

        this.setState({email, displayName})
    }

    signOutUser = () => {
        firebase.auth().signOut();
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            <View style={styles.container}>

                <View>
                    <Text style={styles.greeting}> Hey welcome back {firebase.auth().currentUser.displayName} </Text>
                </View>

                <View style={styles.feedContainer}> 
                    <Text>Feed</Text> 
                </View>

                <View style={styles.feedContainer}>  
                    <Text>Connections</Text> 
                </View>

                

                <TouchableOpacity style={styles.button} onPress={this.signOutUser}>
                    <Text style={{color: "white"}}>Sign Out</Text>
                    </TouchableOpacity>
            </View>
        ); 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        margin: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    button: {
        marginHorizontal: 30,
        marginVertical: 10,
        backgroundColor: "#E9446A",
        borderRadius: 5,
        height: 52,
        alignItems: "center",
        justifyContent: "center"     
    },
    feedContainer: {
        marginHorizontal: 30,
        marginVertical: 10,
        backgroundColor: "white",
        borderColor: "#E9446A",
        borderWidth: 5,
        borderRadius: 5,
        height: 200,
        alignItems: "center",
        justifyContent: "center"
    }
});