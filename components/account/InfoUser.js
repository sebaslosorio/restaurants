import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar} from 'react-native-elements'

export default function InfoUser({ user }) {
    console.log(user)
    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="large"
                source={
                    user.photoURL ? { uri: photoURL} : require("../../assets/avatar-default.jpeg") 
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    }
})
