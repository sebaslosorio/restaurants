import React, { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Avatar} from 'react-native-elements'
import { updateProfile, upLoadImage } from '../../utils/action'
import { loadImageFromGallery } from '../../utils/helpers'

export default function InfoUser({ user, setLoading, setLoadingText }) {

    const [photoUrl, setPhotoUrl] = useState(user.photoURL)

    const changePhoto = async() => {
        const result = await loadImageFromGallery([1, 1])
        if (!result.status) {
            return
        }
        setLoading(true)
        setLoadingText("Actualizando imagen...")        
        const resultUploadImage = await upLoadImage(result.image, "avatars", user.uid)
        if (!resultUploadImage.statusResponse) {
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }
        const resultUpdateProfie = await updateProfile({ photoURL: resultUploadImage.url })
        setLoading(false)
        if (resultUpdateProfie.statusResponse) {
            setPhotoUrl(resultUploadImage.url)
        } else {
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="large"
                onPress={changePhoto}
                source={
                    photoUrl ? { uri: photoUrl} : require("../../assets/avatar-default.jpeg") 
                }
            />
            <View style={styles.infoUser}>
                <Text style={styles.displayName}>
                    {
                        user.displayName ? user.displayName : "Anonimo"
                    }
                </Text>
                <Text>{user.email}</Text>
            </View>
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
    },
    infoUser : {
        marginLeft: 20
    },
    displayName : {
        fontWeight: 'bold',
        paddingBottom : 5
    }
})
