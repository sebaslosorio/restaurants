import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'

export default function ChangeDisplayNameForm({displayName, setShowModal, toastRef}) {
    return (
        <View style={styles.view}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa Nombres y Apellidos"
                leftIcon={{type: "material-community", name: "account-circle-outline", color: "#c2c2c2"}}
            />
            <Button
                title="Cambiar Nombres y Apellidos"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
            >
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    view : {
        alignItems: "center",
        paddingVertical: 10
    },
    input : {
        marginBottom: 10
    },
    btnContainer: {
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})