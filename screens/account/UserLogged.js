import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { closesession, getCurrentUser } from '../../utils/action'
import Toast  from 'react-native-easy-toast'
import Loading from "../../components/Loading"
import InfoUser from '../../components/account/InfoUser'

export default function UserLogged() {

    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadinfText, setLoadinfText] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(getCurrentUser())
    }, [])


    return (
        <View style={styles.container} >
            {
                user && <InfoUser user={user}/>
            }
            <Text>Accoutn Options...</Text>
            <Button
                buttonStyle={styles.BtnCloseSession}
                titleStyle={styles.BtnCloseSessionTitle}                
                title="Cerrar Sesión"
                onPress={() => {
                    closesession()
                    navigation.navigate("restaurants")
                }}        
            />
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
            <Loading
                isVisible={loading}
                Text={"Loading Text"}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        minHeight: "100%",
        backgroundColor: "#f9f9f9"
    },BtnCloseSession : {
        marginTop: 30,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#442484",
        borderBottomWidth: 1,
        borderBottomColor: "#442484",
        paddingVertical: 10
    }, BtnCloseSessionTitle : {
        color: "#442484"
    }
})
