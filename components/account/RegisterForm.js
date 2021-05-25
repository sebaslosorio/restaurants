import { size } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { Icon } from 'react-native-elements'
import { validateEmail } from '../../utils/helpers'
import { useNavigation }from '@react-navigation/native'
import { registerUser } from '../../utils/action'



export default function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())     
    const [errorMail, setErrorMail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("") 
    const navigation = useNavigation() 

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text })
    }

    const doRegisterUser = async() => {
        if (!validateData()) {
            return
        }
        const result = await registerUser(formData.email, formData.password)
        if (!result.statusResponse) {
            setErrorMail(result.error)
            return
        }
        navigation.navigate("account")
    }

    const validateData = () => {
        setErrorConfirm("")
        setErrorMail("")
        setErrorPassword("")
        let isValid = true
        if (!validateEmail(formData.email)) {
            setErrorMail("Debes ingresar un email valido")
            isValid = false
        }
        if (size(formData.password) < 6) {
            setErrorPassword("Debes ingresar una contraseña de 6 caracteres o mas")
            isValid = false
        }
        if (size(formData.confirm) < 6) {
            setErrorConfirm("Debes ingresar una confirmacion de 6 caracteres o mas")
            isValid = false
        }
        if (formData.password !== formData.confirm) {
            setErrorPassword("Las contraseñas no coinciden")
            setErrorConfirm("Las contraseñas no coinciden")
            isValid = false
        }
        return isValid
    }

    return (
        <View style={styles.form}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu email..."
                onChange={(e) => onChange(e, "email")}
                keyboardType="email-address"
                errorMessage={errorMail}
                defaultValue={formData.email}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                onChange={(e) => onChange(e, "password")}
                password={true}
                secureTextEntry={!showPassword}
                errorMessage={errorPassword}
                defaultValue={formData.password}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" } 
                        onPress={() => setShowPassword(!showPassword)}
                        iconStyle={styles.icon}
                    />
                }
            />
            <Input
                containerStyle={styles.input}
                placeholder="Confirma tu contraseña..."
                onChange={(e) => onChange(e, "confirm")}
                password={true}
                secureTextEntry={!showPassword}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" } 
                        onPress={() => setShowPassword(!showPassword)}
                        iconStyle={styles.icon}
                    />
                }
            />
            <Button
                title="Registrar Nuevo Usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={() => doRegisterUser()}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {email : "", password : "", confirm : ""}
}

const styles = StyleSheet.create({
    form : {
        marginTop: 30
    },
    input : {
        width: "100%"
    },
    btnContainer : {
        marginTop : 20,
        width : "95%",
        alignSelf : 'center'
    },
    btn : {
        backgroundColor : "#442484"
    }, 
    icon : {
        color: "#c1c1c1"
    }
})
