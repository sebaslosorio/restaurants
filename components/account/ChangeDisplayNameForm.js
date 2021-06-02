import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { updateProfile } from '../../utils/action'

export default function ChangeDisplayNameForm({displayName, setShowModal, toastRef, setReLoadUser}) {
    const [newDisplayName, setNewDisplayName] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if (!validateForm()) {
            return
        }
        setLoading(true)
        const result = await updateProfile({displayName: newDisplayName})        
        setLoading(false)
        if (!result.statusResponse) {
           setError("Error al actualizar, intenta mas tarde.")
           return
        }
        setReLoadUser(true)
        toastRef.current.show("Actualizacion exitiosa", 3000)
        setShowModal(false)
    }

    const validateForm = () => {
        setError(null)
        if (isEmpty(newDisplayName)) {
            setError("Debes ingresar nombres y apellidos.")
            return false
        }
        if (newDisplayName === displayName) {
            setError("Debes ingresar nombres y apellidos diferentes.")
            return false
        }
        return true
    }

    return (
        <View style={styles.view}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa Nombres y Apellidos"
                defaultValue={displayName}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
                leftIcon={{
                    type: "material-community", 
                    name: "account-circle-outline", 
                    color: "#c2c2c2"
                }}
            />
            <Button
                title="Cambiar Nombres y Apellidos"
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