import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import { Input, Button, Icon, Avatar } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter } from 'lodash'
import { loadImageFromGallery } from '../../utils/helpers'

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName , setErrorName] = useState(null)
    const [errorDescription , setErrorDescription] = useState(null)
    const [errorEmail , setErrorEmail] = useState(null)
    const [errorPhone , setErrorPhone] = useState(null)
    const [errorAddress , setErrorAddress] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])

    const addRestaurant = () => {
        console.log(formData)
        console.log('Vamos Bien...')
    }

    return (
        <View style={styles.viewContainer}>
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorPhone={errorPhone}
                errorAddress={errorAddress}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                buttonStyle={styles.btnAddRestaurant}
                title="Crear Restaurante"
                onPress={addRestaurant}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {
        name : "",
        description : "",
        email : "",
        phone : "",
        address : "",
        country : "CO",
        callingCode : "57"
    }
}

function FormAdd({ formData, setFormData, errorName, errorDescription, errorEmail, errorPhone, errorAddress}) {
    const [country, setCountry] = useState("CO")
    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState("")
    const onChange = (e, type) => {
        setFormData({...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante..."
                defaultFormValues={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Direccion del restaurante..."
                defaultFormValues={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
            />
            <Input                    
                keyboardType="email-address"
                placeholder="Email del restaurante..."
                defaultFormValues={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({...formData, "country" : country.cca2, "callingCode" : callingCode[0]})
                    }}
                />
                <Input
                    containerStyle={styles.inputPhone}
                    defaultFormValues={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                    keyboardType="phone-pad"
                    placeholder="WhatsApp del Restaurante..."

                />
            </View>
            <Input
                    containerStyle={styles.textArea}
                    defaultFormValues={formData.description}
                    onChange={(e) => onChange(e, "description")}
                    errorMessage={errorDescription}
                    multiline
                    placeholder="Descripcion del Restaurante..."
                />
        </View>
    )
}

function UploadImage ({toastRef, imagesSelected, setImagesSelected}) {
    const imageSelect = async () => {
        const response = await loadImageFromGallery([4,3])
        if (!response.status) {
            toastRef.current.show("No has selecionada ninguna imagen.", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "Estas seguro de eliminar la imagen ?",
            [
                {
                    text : "No",
                    style : "cancel"
                },
                {
                    text : "Si",
                    onPress : () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {
                cancelable : true
            }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImage}
        >
        {
            size(imagesSelected) < 10 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )
        }
        {
            map(imagesSelected, (imageRestaurant, index)=> (
                <Avatar
                    key={index}
                    style={styles.imgAvatar}
                    source={{uri : imageRestaurant}}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))
        }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewContainer : {
        height : "100%",
        margin : 5
    }, 
    viewForm : {
        marginHorizontal : 10
    },
    phoneView : {
        width : "80%",
        flexDirection : "row"
    },
    countryPicker : {

    },
    inputPhone : {
        width : "80%"
    }, 
    textArea : {
        height : 100,
        width : "100%"
    },
    btnAddRestaurant : {
        margin : 20,
        backgroundColor : "#442484"
    }, 
    viewImage : {
        flexDirection : "row",
        marginHorizontal : 20,
        marginTop : 30
    }, 
    containerIcon : {
        alignItems : "center",
        justifyContent : "center",
        marginRight : 10,
        height : 70,
        width : 70,
        backgroundColor : "#e3e3e3"
    }, 
    imgAvatar : {
        width : 70,
        height : 70,
        marginRight : 10
    }
})
