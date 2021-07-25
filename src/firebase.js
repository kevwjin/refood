import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyCCcdbiuG287wCxcntd9Zmb0FZlLYtCYxs",
    authDomain: "refood-75a72.firebaseapp.com",
    databaseURL: "https://refood-75a72-default-rtdb.firebaseio.com",
    projectId: "refood-75a72",
    storageBucket: "refood-75a72.appspot.com",
    messagingSenderId: "878850802529",
    appId: "1:878850802529:web:87b2ccc79a156cd620fb20"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;