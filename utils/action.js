import { firebaseApp } from './firebase'
import firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
    return isUserLogged
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const registerUser = async (email, password) => {
    const result = { statusResponse : true, error : null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.error = "Este correo ya esta registrado"
    }
    return result
}

export const closesession = () => {
    return firebase.auth().signOut()
}