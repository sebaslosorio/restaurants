import { isEmpty, size } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { updatePassword, reauthenticate } from '../../utils/action'

export default function ChangePasswordForm({setShowModal, toastRef}) {
    const [newPassword, setNewPassword] = useState(null)
    const [currentPassword, setCurrentPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [errorNewPassword, setNewErrorPassword] = useState(null)
    const [errorCurrentPassword, setCurrentErrorPassword] = useState(null)
    const [erroConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if (!validateForm()) {
            return
        }
        setLoading(true)
        const resultReauthenticate = await reauthenticate(currentPassword)  
        if (!resultReauthenticate.statusResponse) {
            setLoading(false)
            setCurrentPassword("Contraseña incorrecta.")
           return
        }
        const resultUpdatePassword = await updatePassword(newPassword)
        setLoading(false)
        if (!resultUpdatePassword.statusResponse) {
           setNewErrorPassword("No se puede cambiar la contraseña.")
           return
        }
        toastRef.current.show("Actualizacion exitiosa", 3000)
        setShowModal(false)
    }

    const validateForm = () => {
        setNewErrorPassword(null)
        setCurrentErrorPassword(null)
        setErrorConfirmPassword(null)
        let isValid = true
        if (isEmpty(currentPassword)) {
            setCurrentErrorPassword("Debes ingresar tu contraseña actual.")
            isValid = false
        }
        if (size(newPassword) < 6) {
            setNewErrorPassword("Debes ingresar una nueva contraseña de al menos 6 caracteres.")
            isValid = false
        }
        if (size(confirmPassword) < 6) {
            setErrorConfirmPassword("Debes ingresar una confirmacion de tu contraseña de al menos 6 caracteres.")
            isValid = false
        }
        if (newPassword !== confirmPassword) {
            setErrorConfirmPassword("La nueva contraseña y la confirmacion no son iguales.")
            setNewErrorPassword("La nueva contraseña y la confirmacion no son iguales.")
            isValid = false
        }
        if (newPassword === currentPassword) {
            setErrorConfirmPassword("Debes ingresar una contraseña diferente a la actual.")
            setNewErrorPassword("Debes ingresar una contraseña diferente a la actual.")
            setCurrentErrorPassword("Debes ingresar una contraseña diferente a la actual.")
            isValid = false
        }
        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa contraseña actual"
                defaultValue={currentPassword}
                onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
                errorMessage={errorCurrentPassword}
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
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña"
                defaultValue={newPassword}
                onChange={(e) => setNewPassword(e.nativeEvent.text)}
                errorMessage={errorNewPassword}
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
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña"
                defaultValue={confirmPassword}
                onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
                errorMessage={erroConfirmPassword}
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
                title="Cambiar Contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
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