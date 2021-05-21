import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDPepU-x5Q4q94DlPqW8_WuUso5RYFfkVM",
    authDomain: "restaurants-6b5ff.firebaseapp.com",
    projectId: "restaurants-6b5ff",
    storageBucket: "restaurants-6b5ff.appspot.com",
    messagingSenderId: "70075768506",
    appId: "1:70075768506:web:6d1a0f5761aeb2ce7dac83"
  }

  export const firebaseApp = firebase.initializeApp(firebaseConfig);