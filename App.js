import React from 'react';
import {LayoutAnimation, Image} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator, HeaderTitle} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Ionicons} from '@expo/vector-icons';


import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterScreenIndividual from './screens/ResgisterScreenIndividual'
import RegisterScreenIndividual2 from './screens/RegisterScreenIndividual2'
import RegisterScreenIndividual3 from './screens/RegisterScreenIndividual3'

import ProfileScreen from './screens/ProfileScreen';

import ChatScreen from './screens/ChatScreen'
import SearchScreen from './screens/SearchScreen'
import ViewProfileScreen from './screens/ViewProfileScreen'


import ChatListScreen from './screens/ChatListScreen'
import FitScreen from './screens/FitScreen'
import * as firebase from 'firebase';
import Fire from './FireSVC'
import GroupChatScreen from './screens/GroupChatScreen';

var firebaseConfig = {
  apiKey: "AIzaSyCDwaL6KhosB0na6FzVG-u4cGv9dE-eGMY",
  authDomain: "test-project-3b438.firebaseapp.com",
  databaseURL: "https://test-project-3b438.firebaseio.com",
  projectId: "test-project-3b438",
  storageBucket: "test-project-3b438.appspot.com",
  messagingSenderId: "128890118814",
  appId: "1:128890118814:web:622cf67787015e4325118f",
  measurementId: "G-WNR2GKSCJ5"
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

console.disableYellowBox = true;

const AppTabNavigator = createBottomTabNavigator(
  {
  Fit: {
    screen: FitScreen,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <Ionicons name="ios-people" size={30} color={tintColor} />,
      
      }
    },
  Chats: {
    screen: ChatListScreen,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <Ionicons name="ios-chatboxes" size={24} color={tintColor} />,      
      }
    },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <Ionicons name="ios-search" size={24} color={tintColor} />,      
      }
    },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <Image 
                        source={(Fire.shared.user.photoURL) ? {uri: Fire.shared.user.photoURL} : require("./assets/fitLogo.jpg")}
                        style={styles.avatar}
                        /> ,      
      }
    },
    //Add tabs here
  }, 
  {
    tabBarOptions: {
      activeTintColor: '#4A37DE',
      inactiveTintColor: 'gray',
      
      tabStyle: {
        padding: 10
      },
      style: {
        height: 75,
        //alignItems: "center",
        //justifyContent: "center"
      }
    },
  }
)

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
  RegisterI: RegisterScreenIndividual,
  RegisterI2: RegisterScreenIndividual2,
  RegisterI3: RegisterScreenIndividual3
});


export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppTabNavigator,
      Auth: AuthStack,
      Chat: ChatScreen,
      GroupChat: GroupChatScreen,  
      Profile: ProfileScreen,
      ViewProfile: ViewProfileScreen    
    }, 
    {
      initialRouteName: "Loading"
    }
  )
);

const styles = {
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 50
  },
}