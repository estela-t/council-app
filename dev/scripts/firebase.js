import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAISt9s1OzEt8TM8gNYjICxhqc001WQhg4",
  authDomain: "city-council-app.firebaseapp.com",
  databaseURL: "https://city-council-app.firebaseio.com",
  projectId: "city-council-app",
  storageBucket: "city-council-app.appspot.com",
  messagingSenderId: "768145263721"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const database = firebase.database();
export const dbRef = database.ref("/");
export const provider = new firebase.auth.GoogleAuthProvider;
export default firebase; 