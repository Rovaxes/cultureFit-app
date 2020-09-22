import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator,LayoutAnimation} from 'react-native'
import * as firebase from 'firebase'; 

export default class LoadingScreen extends React.Component {

    componentDidMount(){

        /*Switches stacks based on user login */
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "App" : "Auth");
        })
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            <View style={styles.container}>
                <Text> Loading Screen </Text>
                <ActivityIndicator size="large"/>
            </View>
        ); 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});