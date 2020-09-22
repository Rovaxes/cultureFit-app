import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, LayoutAnimation, Image, StatusBar, KeyboardAvoidingView, ScrollView} from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
    }


    state = {
        email: "example_@email.com",
        password: "password",
        errorMessage: null
    };


    handleLogin = () => {
        const {email, password} = this.state;

        firebase.auth().signInWithEmailAndPassword(email, password).catch(error => this.setState({errorMessage: error.message}));
    }

    render() {
        LayoutAnimation.easeInEaseOut();

        return (
            <LinearGradient
                    colors={['#6DFACF', '#4936DE']}
                    style={{ flex:1 }}
                >
            <KeyboardAvoidingView enabled>
            <ScrollView>
            <View style={styles.container}>
                <StatusBar barStyle="light-content"></StatusBar>

                <View style={{justifyContent: "center", alignItems: "center", paddingTop: 30}}>
                    <Image source={require("../assets/fitslogo.png")} style={{height: 100, resizeMode: "cover", marginBottom: 20}}></Image>
                    <Image source={require("../assets/picture1.png")} style={{height: 150, resizeMode: "cover"}}></Image>
                </View>
                               

                <View>
                    <Text style={styles.errorMessage}> 
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </Text>
                </View>

                <View style={styles.form} behavior="padding" keyboardVerticalOffset={30} enabled>
                    <View style={styles.interactContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                style={styles.input} 
                                autoCapitalize="none"
                                onChangeText={email => this.setState({email})}
                                placeholder="example@email.com"
                                selectionColor="white"
                            />
                        </View>
                    </View>

                    <View style={styles.interactContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput 
                                style={styles.input} 
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={password => this.setState({password})}                               
                                value={this.state.password}
                                onFocus={() => this.setState({password: ""})}
                                selectionColor="white"
                            />
                        </View>
                    </View>
                

                    <View style={styles.interactContainer}>
                        <TouchableOpacity style={styles.greenButton} onPress={this.handleLogin}>
                            <Text style={styles.signInText} > Continue </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.interactContainer}>
                        <TouchableOpacity style={styles.blueButton} onPress={this.handleLogin}>
                            <Text style={styles.signInText} > Sign in with Gmail </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={styles.signUp} 
                        onPress={() => this.props.navigation.navigate("Register")}                    >
                        <Text style={styles.signUpText}>
                            Need a new account? <Text style={{color: "white", fontWeight: "bold", textDecorationLine: "underline"}}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                    
                </View>

            </View>     
            </ScrollView>    
            </KeyboardAvoidingView>   
            </LinearGradient>
        ); 
    }
}

function logState(email) {
    console.log(this.state);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    interactContainer: {
        margin: 10,
        height: 40
        
    },
    greeting: {
        margin: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    errorMessage: {
        textAlign: "center",       
        margin: 10, 
        justifyContent: "center",
        fontSize: 13
    },
    error: {
        color: "white",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginVertical: 10,
        marginHorizontal: 30
    },
    inputContainer: {
        //borderBottomColor: "#8A8F9E",
        //borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 10,
        height: "100%",
        fontSize: 15,
        alignItems: "center",
        justifyContent: "center"
    }, input: {
        height: "75%",
        width: "90%",
        color: "white"
        
    },
    gap: {
        marginBottom: 35
    },
    greenButton: {
        backgroundColor: "#CB357A",
        borderRadius: 10,
        height: "100%",
        alignItems: "center",
        justifyContent: "center"     
    },
    blueButton: {
        backgroundColor: "lightblue",
        borderRadius: 10,
        height: "100%",
        alignItems: "center",
        justifyContent: "center"     
    },
    signInText: {
        color: "#FFF",
        fontWeight: "500",
        textTransform: "uppercase"
    },
    signUp: {
        alignSelf: "center",
        margin: 10
    },
    signUpText: {
        fontSize: 14,
        color: "white"
    }
});