import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { reauthenticate, updateEmail } from '../../utils/action'
import { validateEmail } from '../../utils/helpers'

export default function ChangeEmailForm({email, setShowModal, toastRef, setReLoadUser}) {
    const [newEmail, setNewEmail] = useState(email)
    const [password, setPassword] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorPassword, setErrorPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if (!validateForm()) {
            return
        }
        setLoading(true)
        const resultReauthenticate = await reauthenticate(password)  
        if (!resultReauthenticate.statusResponse) {
            setLoading(false)
            setErrorPassword("Contraseña incorrecta.")
           return
        }
        const resultUpdateEmail = await updateEmail(newEmail)
        setLoading(false)
        if (!resultUpdateEmail.statusResponse) {
           setErrorEmail("No se puede cambiar por este correo, ya esta en uso por otro usuario.")
           return
        }
        setReLoadUser(true)
        toastRef.current.show("Actualizacion exitiosa", 3000)
        setShowModal(false)
    }

    const validateForm = () => {
        setErrorEmail(null)
        setErrorPassword(null)
        let isValid = true
        if (!validateEmail(newEmail)) {
            setError("Debes ingresar un email valido.")
            isValid = false
        }
        if (newEmail === email) {
            setErrorEmail("Debes ingresar un email diferente al actual.")
            return false
        }
        if (isEmpty(password)) {
            setErrorPassword("Debes ingresar tu contraseña.")
            isValid = false
        }
        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa Email"
                defaultValue={email}
                keyboardType="email-address"
                onChange={(e) => setNewEmail(e.nativeEvent.text)}
                errorMessage={errorEmail}
                leftIcon={{
                    type: "material-community", 
                    name: "at", 
                    color: "#c2c2c2"
                }}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña"
                defaultValue={password}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                errorMessage={errorPassword}
                password={true}
                secureTextEntry={!showPassword}
                leftIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={ {color: "#c2c2c2"} }
                        onPress={() => setShowPassword(!showPassword)} 
                    />
                }
            />
            <Button
                title="Cambiar Email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                loading={loading}
                onPress={onSubmit}
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