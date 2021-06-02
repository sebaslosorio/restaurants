import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { closesession, getCurrentUser } from '../../utils/action'
import Toast  from 'react-native-easy-toast'
import Loading from "../../components/Loading"
import InfoUser from '../../components/account/InfoUser'
import AccountOptions from '../../components/account/AccountOptions'

export default function UserLogged() {

    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)
    const [reLoadUser, setReLoadUser] = useState(false)

    useEffect(() => {
        setUser(getCurrentUser())
        setReLoadUser(false)
    }, [reLoadUser])

    return (
        <View style={styles.container} >
            {
                user && (
                    <View>
                        <InfoUser 
                            user = { user }
                            setLoading = {setLoading}
                            setLoadingText = {setLoadingText}
                        />
                        <AccountOptions
                            user = { user }
                            toastRef = { toastRef }
                            setReLoadUser = {setReLoadUser}
                        />
                    </View>
                )
            }            
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
                isVisible={loading} Text={loadingText}
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
    }, 
    BtnCloseSessionTitle : {
        color: "#442484"
    }
})
