import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, LayoutAnimation, StatusBar, CheckBox, FlatList, Image, ScrollView, KeyboardAvoidingView} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'
import UserPermissions from '../utilities/UserPermissions'
import * as ImagePicker from 'expo-image-picker'
import FireSVC from '../FireSVC'

const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={styles.option}>
      <Text style={styles.optionText}>{item.field}</Text>
    </TouchableOpacity>
);

export default class RegisterScreenIndividual3 extends React.Component {
    static navigationOptions = {
        headerShown: false
    }

    state = {
        name: "Full Name",
        email: "Email",
        password: "Password",
        fields: [],
        interests: [],
        avatar: null,
        title: "",
        about: "",
        errorMessage: null
    };

    componentDidMount() {
        console.log("Mounted Indi")
        this.loadPrevious()
    }

    loadPrevious = async () => {
        const {name, email, password, interests, fields} = this.props.navigation.state.params;
        await this.setState({name, email, password, interests, fields});
        console.log(this.state)
    }

    handleSignUp = () => {
        console.log("signing up");
        console.log(this.state.interests);
        FireSVC.shared.createUser( {
            email: this.state.email,
            password: this.state.password,
            avatar: this.state.avatar,
            displayName: this.state.name,
            fields: this.state.fields,
            interests: this.state.interests,
            title: this.state.title,
            about: this.state.about
        } );
    }

    addInterest = () => {
        if(this.state.add.length > 0) {
            var copy = this.state.fields;

            var newField = {
                field: this.state.add
            };

            copy.push(newField);

            this.setState({fields: copy});
            console.log(this.state.fields)
        }

    }

    removeInterest = (item) => {
        console.log(item)
        var filtered = this.state.fields.filter(i => i.field !== item.field);

        this.setState({fields: filtered});
        console.log(this.state.fields)
        console.log("removed: " + item.interest);
    }

    renderItem = ({ item }) => {
        //const backgroundColor = "#6e3b6e" ;
        //console.log(item);
        return (
          <Item
            item={item} 
            onPress={() => this.removeInterest(item)}          
          />
        );
    };

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

    //  <Image source={{uri: this.state.avatar}} style={styles.profilePic}></Image>

    renderRegisterBaic = () => {
        return (
            
            <View style={styles.form}>
                <View style={styles.interactContainer}>
                    <Text style={{fontSize: 18}}>Sweet! Last but not least, upload your picture to rock the place! </Text>

                    <TouchableOpacity style={{alignItems: "center"}} onPress={this.handlePickAvatar}> 
                        
                        {(this.state.avatar === null) ?
                            (<View style={styles.profilePic}>                       
                                <Ionicons name="ios-camera" size={42} color="black"></Ionicons>                                        
                            </View>) : <Image source={{uri: this.state.avatar}} style={styles.profilePic}></Image>
                        }


                        <Text style={{margin: 10, fontSize: 16, color: "#404040"}}>Add Photo</Text>   
                    </TouchableOpacity>       

                <View style={{marginBottom: 20}}>
                    <Text style={{fontSize: 16, fontWeight: "900"}}>Title (Optional)</Text>
                    <TextInput 
                        style={[styles.input, {height: 50}]} 
                        autoCapitalize="none"
                        onChangeText={title => this.setState({title})}
                        value={this.state.title}
                    />
                </View>

                <View>
                    <Text style={{fontSize: 16, fontWeight: "900"}}>Say something about yourself</Text>
                    <TextInput 
                        style={[styles.input, {height: 100}]} 
                        autoCapitalize="none"
                        onChangeText={about => this.setState({about})}
                        value={this.state.about}
                    />
                </View>


                <TouchableOpacity 
                        style={styles.next}
                        onPress={this.handleSignUp}
                >                 
                        <Ionicons name="ios-arrow-round-forward" size={32} color="#FFF"></Ionicons>
                </TouchableOpacity> 

                </View>

            </View>
        )
    }

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
                
                <StatusBar barStyle="light-content"></StatusBar>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.greeting}> Sign Up </Text>
                    </View>   
                    <View style={styles.progressBar}>
                        <View style={styles.progress}></View>
                    </View>                
                </View>               

                {this.renderRegisterBaic()}                             

                <TouchableOpacity 
                    style={styles.back}
                    onPress={() => this.props.navigation.goBack()}
                    >                 
                    <Ionicons name="ios-arrow-back" size={44} color="black"></Ionicons>
                </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>            
        ); 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    option: {
        backgroundColor: "#8FD4AB",
        borderRadius: 4,
        paddingVertical: 5, 
        paddingHorizontal: 10,
        margin: 5 
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
    optionText: {
        fontSize: 16
    },
    list: {
        //justifyContent: 'center',
        //flexDirection: 'row',
        //flexWrap: 'wrap',
    },
    green: {
        color: "#11AF60"
    },
    greeting: {
        margin: 24,
        fontSize: 30,
        fontWeight: "400",
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
        marginHorizontal: 20
    },
    interactContainer: {
        margin: 10,
        height: 40
        
    },inputContainer: {
        //borderBottomColor: "#8A8F9E",
        //borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#11AF60",
        borderWidth: 2,
        borderRadius: 50,
        height: "100%",
        fontSize: 15,
        alignItems: "center",
        justifyContent: "center"
    }, input: {
        borderColor: "#707070",
        borderWidth: 0.2,
        color: "#707070",
        fontSize: 16,
        padding: 5      
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#11AF60",
        borderRadius: 20,
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
        //backgroundColor: "rgba(21, 22, 48, 0.1)",
        alignItems: "center",
        justifyContent: "center"  
    },
    next: {
        marginVertical: 10,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#C673B3",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end"  
    },

    headerContainer: {
        alignItems: "center",
        margin: 20,
        marginBottom: 5
        
    },
    interactContainer: {
        margin: 10,
        marginBottom: 0        
    },    
    searchBarContainer: {
        flexDirection: "row",
        backgroundColor: "#FCFAFA",
        borderRadius: 50,
        //marginHorizontal: 10,
        alignContent: "center",
        padding: 5,
        marginVertical: 5,
        height: 35
    },
    searchBar: {
        //backgroundColor: "red",
        fontSize: 16,
        width: "90%"
    },
    progressBar: {
        alignSelf: "center",
        height: 10,
        width: "90%",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#D5D5D5"
    },
    progress: {
        backgroundColor: "#7463F5",
        height: "100%",
        width: "100%"
    }
});