import firebase from "firebase";
import { call } from "react-native-reanimated";

require('firebase/firestore')
require('firebase/auth')

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

class Fire{

  constructor(){
    if(firebase.apps.length === 0){
      firebase.initializeApp(firebaseConfig);
    }
  }

  async getChatsWithCurrentUser(callback){
    //console.log()
    await this.firestore.collection('private_rooms')
    
        .where('users', 'array-contains', this.userObj)
        
        .onSnapshot(async querySnapshot => {          
            console.log("here")
            var chats = []
            querySnapshot.forEach(doc => {
                var data = doc.data();
                console.log("found some het")
                var chat = {
                    id: doc.id,
                    users: data.users,
                    messages: data.messages
                }

                chats.push(chat);                      
            })  
            console.log("chats: " + chats);
            callback(chats);        
        });           
  }

  createChatWithUser = async (user1, user1Name) => {
    var users = []

    users.push(this.user.uid);
    users.push(user1);
    users.sort();

    var usersObj = []

    var usersObj1 = {
      displayName: user1Name,
      uid: user1
    }

    usersObj.push(usersObj1);
    usersObj.push(this.userObj);

    usersObj.sort((a,b) => (a.uid > b.uid) ? 1 : -1);

    console.log("users: " + users);
    console.log("usersOb: " + usersObj);

    var docID =  usersObj[0].uid + ":" + usersObj[1].uid;
    var docRef =  (await this.firestore.collection("private_rooms").doc(docID).get()).exists
    console.log("docRef: " + docRef)
    if(!docRef){
      // Add a new document in collection "cities"
      this.firestore.collection("private_rooms").doc(docID).set({
        users: [usersObj[0].uid, usersObj[1].uid],
        names: [usersObj[0].displayName, usersObj[1].displayName]
      })
      .then(function() {
        console.log("Document successfully written!");
        return docID;
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
        return docID;
      });
    }
    return docID;
  }

  joinGroup = async (id) => {
    var docID = id;

    return this.firestore.collection('groups')
      .doc(id)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(
          this.userObj
        )
      }).then(function() {
        console.log("Document successfully written!");
        return docID;
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
        return docID;
      });
  }

  updateInterests = (tags) => {
    this.firestore.collection("users").doc(this.uid).update({
      interests: tags
      })
  }

  async getChat(id, callback){
      
    await this.firestore.collection('private_rooms')
    
        .doc(id)
        
        .onSnapshot(async querySnapshot => {          
            console.log("Got the Doc! " + querySnapshot.data())      
            var doc = querySnapshot.data();  
            var chat = {
              id: doc.id,
              users: doc.users,
              messages: doc.messages
            }

            console.log(chat);
            callback(chat);        
        });           
  }

  handleSend(messages, doc) {
    //const text = messages[0].text;

    console.log(messages[0]);
    console.log(doc);
    
    this.firestore.collection('private_rooms')
      .doc("mZtlMfJphCaEBqwu2IOt")
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          _id: messages[0]._id,
          text: messages[0].text,
          timestamp: firebase.firestore.Timestamp.now().seconds,
          createdAt: firebase.firestore.Timestamp.now().toMillis(),
          user: messages[0].user,
          //createdAt: messages[0].createdAt
        })
      });
  }

  send = (messages, id) => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        date: firebase.firestore.Timestamp.now(),
        user: item.user
      }
      this.db.child(id).push(message);

      this.firestore.collection('private_rooms')
      .doc(id)
      .update({
        seen: false, 
        latestMsg: message
      }); 

    });    
  }

  sendGroup = (messages, id) => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        date: firebase.firestore.Timestamp.now(),
        user: item.user
      }
      this.db.child(id).push(message);

      this.firestore.collection('groups')
      .doc(id)
      .update({
        seen: false, 
        latestMsg: message
      }); 

    });    
  }

  updateSeen = (id) => {
    this.firestore.collection('private_rooms')
    .doc(id)
    .update({
      seen: true
    }); 
  }

  updateSeenGroup = (id) => {
    this.firestore.collection('groups')
    .doc(id)
    .update({
      seen: true
    }); 
  }

  parse = message => {
    const {user, text, timestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);

    return {
      _id,
      createdAt,
      text,
      user
    };
  }

  get = (callback, id) => {
    console.log("HERE");
    this.db.child(id).on("child_added", snapshot => callback(this.parse(snapshot)));
  }

  getLatest = (id, callback) => {
    console.log("HERE");
    this.db.child(id).limitToLast(1).on("child_added", snapshot => callback(this.parse(snapshot)));
  }

  getProfile = (id) => {
    return this.firestore.collection("users").doc(id).get();
  }

  uploadPhotoAsync = async (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase
        .storage()
        .ref(filename)
        .put(file);

      upload.on(
        "state_changed",
        snapshot => {},
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  }

  createUser = async newUser => {
    let remoteUri = null;
    console.log("creating User!")
    try{
      await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);

      this.user.updateProfile({displayName: newUser.displayName})

      let db = this.firestore.collection("users").doc(this.uid);
      db.set({
        displayName: newUser.displayName,
        email: newUser.email,
        avatar: null,
        fields: newUser.fields,
        interests: newUser.interests,
        title: newUser.title,
        about: newUser.about,
        uid: this.user.uid
      });

      if(newUser.avatar) {
        remoteUri = await this.uploadPhotoAsync(newUser.avatar, 'avatars/' + this.uid)

        db.set({avatar: remoteUri}, {merge: true});
        this.user.updateProfile({photoURL: remoteUri})
      }
      console.log("User made")

    } catch (error) {
        alert("Error: " + error.message)
        console.log("error")
    }
  }

  createGroup = async (gname, gavatar, gdescription, gtags) => {

    try{

      console.log(gname)
      console.log(gavatar)
      console.log(gdescription)
      console.log(gtags)
      let db = this.firestore.collection("groups").doc(gname);
      db.set({
        name: gname,
        description: gdescription,
        tags: gtags
      });

      if(gavatar) {
        var remoteUri = await this.uploadPhotoAsync(gavatar, 'avatars/' + this.gname)

        db.set({uri: remoteUri}, {merge: true});
      }
      console.log("Group made")

    } catch (error) {
        alert("Error: " + error.message)
        console.log("error")
    }
  }

  updateUserProfileImage(uri) {

    var user = this.user
    this.firestore.collection('users').doc(this.uid)
    .update({avatar: uri})
    .then(function() {
      user.updateProfile({photoURL: uri});
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }



  off(){
    this.db.off();
  }


  get userAvatar() {
    return this.getProfile(this.uid);
  }

  get firestore() {
    return firebase.firestore();
  }

  get db() {
    return firebase.database().ref("messages");
  }

  get uid () {
    return (firebase.auth().currentUser || {}).uid
  }

  get user() {
      return (firebase.auth().currentUser)
  }

  get userObj(){
    return {
      displayName: this.user.displayName,
      uid: this.uid
    }
  }
  get timestamp(){
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;