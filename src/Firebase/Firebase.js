import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD2S8HNqiyEf0Mc46tlVfkd8gBJGIrwzbM",
  authDomain: "react-book-notes-f64a3.firebaseapp.com",
  projectId: "react-book-notes-f64a3",
  storageBucket: "react-book-notes-f64a3.appspot.com",
  messagingSenderId: "364948880716",
  appId: "1:364948880716:web:45b6e399da309bab31a3e9",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
