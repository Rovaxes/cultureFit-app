import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, LayoutAnimation, StatusBar, CheckBox} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient';

export default class RegisterScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
    }

    state = {
        name: "Full Name",
        email: "Email",
        password: "Password",
        errorMessage: null
    };

    renderRegisterBaic = () => {
        return (
            <View style={styles.form}>
                    
            <View style={styles.interactContainer}>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        autoCapitalize="none"
                        onChangeText={name => this.setState({name})}
                        value={this.state.name}
                        onFocus={() => this.setState({name: ""})}
                        placeholder="Full Name"
                        selectionColor="white"
                    />
                </View>
            </View>

            <View style={styles.interactContainer}>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        autoCapitalize="none"
                        onChangeText={email => this.setState({email})}
                        value={this.state.email}
                        onFocus={() => this.setState({email: ""})}
                        placeholder="Email"
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
                        placeholder="password"
                        selectionColor="white"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate("RegisterI", {name: this.state.name, email: this.state.email, password: this.state.password})}}>
                    <Text style={styles.signInText}>Get Started!</Text>
            </TouchableOpacity> 

            <View style={{marginHorizontal: 10, marginVertical: 20}}> 
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 14, color: "white"}}>By signing up you agree to our <Text style={{fontWeight: "bold"}}>Terms and Services</Text></Text>
                </View>
            </View>


        </View>
        
        )
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            <LinearGradient
                    colors={['#7D6DFA', '#4936DE']}
                    style={{ flex:1 }}
                >
            <View style={styles.container}>
                
                <StatusBar style={[styles.header, {}]} barStyle="light-content"></StatusBar>
                <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.greeting}> Sign Up </Text>
                </View>
                </View>
                

                <View>
                    <Text style={styles.errorMessage}> 
                        {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                    </Text>
                </View>


                {this.renderRegisterBaic()}              

            </View>   

            <TouchableOpacity 
                    style={styles.back}
                    onPress={() => this.props.navigation.goBack()}
                >                 
                    <Ionicons name="ios-arrow-back" size={44} color="white"></Ionicons>
            </TouchableOpacity>
            </LinearGradient>         
        ); 
    }
}

function logState(email) {
    console.log(this.state);
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    green: {
        color: "white"
    },
    greeting: {
        margin: 24,
        fontSize: 30,
        fontWeight: "400",
        color: "white"
    },
    errorMessage: {
        textAlign: "center",       
        margin: 5, 
        justifyContent: "center",
        fontSize: 13
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginVertical: 10,
        marginHorizontal: 30
    },interactContainer: {
        margin: 10,
        height: 40
        
    },inputContainer: {
        //borderBottomColor: "#8A8F9E",
        //borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 15,
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
    button: {
        margin: 10,
        backgroundColor: "#CB357A",
        borderRadius: 15,
        height: 52,
        alignItems: "center",
        justifyContent: "center"     
    },
    signInText: {
        color: "#FFF",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    signUp: {
        alignSelf: "center",
        margin: 35
    },
    signUpText: {
        fontSize: 14
    },
    back: {
        position: "absolute",
        top: 48,
        left: 32,
        width:40,
        height: 40,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center"  
    },
    headerContainer: {
        alignItems: "center",
        margin: 20
        
    },
    interactContainer: {
        margin: 10,
        height: 50        
    }
});