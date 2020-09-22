import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, LayoutAnimation, StatusBar, CheckBox, FlatList} from 'react-native'
import * as firebase from 'firebase'
import {Ionicons} from '@expo/vector-icons'

const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={styles.option}>
      <Text style={styles.optionText}>{item.field}</Text>
    </TouchableOpacity>
);

export default class RegisterScreenIndividual2 extends React.Component {
    static navigationOptions = {
        headerShown: false
    }

    state = {
        name: "Full Name",
        email: "Email",
        password: "Password",
        fields: [
            {field: "Hospitality"},
            {field: "Tech"},
            {field: "Service"}
        ],
        interests: [],
        newInterest: {interest: ""},
        add: "Add interest...",
        errorMessage: null
    };

    componentDidMount() {
        console.log("Mounted Indi")
        this.loadPrevious()
    }

    loadPrevious = async () => {
        const {name, email, password, interests} = this.props.navigation.state.params;
        await this.setState({name, email, password, interests});
        console.log(this.state)
    }

    addField = () => {
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

    removeField = (item) => {
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
            onPress={() => this.removeField(item)}          
          />
        );
    };

    renderRegisterBaic = () => {
        return (
            <View style={styles.form}>
                <View style={styles.interactContainer}>
                    <Text style={{fontSize: 18}}>I'm interested in companies in the following fields: </Text>
                </View>
                <View style={styles.interactContainer}>
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="ios-search" size={24} style={{marginHorizontal: 10}}/>
                        <TextInput 
                            style={styles.searchBar}
                            value={this.state.add}
                            onChangeText={text => this.setState({add: text})}
                            onSubmitEditing={(value) => this.addField(value)}   
                            onFocus={() => this.setState({add: ""})}            
                        >
                        </TextInput>  

                    </View>

                    <View style={{marginTop: 20, height: 250 }}>
                            <FlatList
                                contentContainerStyle={styles.list}
                                data={this.state.fields}
                                renderItem={this.renderItem}
                                extraData={this.state}
                                numColumns={3}
                                columnWrapperStyle
                                keyExtractor={(item) => item.field}
                            />
                    </View>

                    <TouchableOpacity 
                            style={styles.next}
                            onPress={() => {this.props.navigation.navigate("RegisterI3", 
                                {
                                    name: this.state.name, 
                                    email: this.state.email, 
                                    password: this.state.password, 
                                    interests: this.state.interests,
                                    fields: this.state.fields
                                })}}
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
            <View style={styles.container}>
                
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

            </View>            
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
    option: {
        backgroundColor: "#DFE0DF",
        borderRadius: 4,
        paddingVertical: 5, 
        paddingHorizontal: 10,
        margin: 5 
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
        color: "#DFE0DF"
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
        height: "75%",
        width: "90%",
        color: "green"       
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
        alignItems: "center",
        justifyContent: "center"  
    },
    next: {
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
        height: 50        
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
        width: "66.66%"
    }
});