import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native'
import { Input, Button, Icon, Avatar, Image } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, isEmpty } from 'lodash'
import MapView from 'react-native-maps'
import { getCurrentLocation, loadImageFromGallery, validateEmail } from '../../utils/helpers'
import Modal from '../../components/Modal'
import uuid from 'random-uuid-v4'
import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../utils/action'

const widthScreen = Dimensions.get("window").width

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName , setErrorName] = useState(null)
    const [errorDescription , setErrorDescription] = useState(null)
    const [errorEmail , setErrorEmail] = useState(null)
    const [errorPhone , setErrorPhone] = useState(null)
    const [errorAddress , setErrorAddress] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = async () => {
        if (!validForm()) {
            return
        }
        setLoading(true)
        const responseUploadImages = await uploadImages()
        const restaurant = {
            name            : formData.name,
            address         : formData.address,
            descripcion     : formData.description,
            email           : formData.email,
            callingCode     : formData.callingCode,
            phone           : formData.phone,
            location        : locationRestaurant,
            images          : responseUploadImages,
            rating          : 0,
            ratingTotal     : 0,
            quantityVoting  : 0,
            createAt        : new Date(),
            creatreBy       : getCurrentUser().uid

        }
        const responseAddDocument = await addDocumentWithoutId("restaurants", restaurant)
        setLoading(false)
        if (!responseAddDocument.statusResponse) {
            toastRef.current.show("Error al grabar el restaurante, por favor intenta mas tarde.", 3000)
            return
        }
        navigation.navigate("restaurants")
    }

    const uploadImages = async () => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "restaurants", uuid())
                if (response.statusResponse) {
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearError()
        let isValid = true

        if (isEmpty(formData.name)) {
            setErrorName("Debe ingresar un nombre de restaurante.")
            isValid = false
        }
        if (isEmpty(formData.description)) {
            setErrorDescription("Debe ingresar una descripcion de restaurante.")
            isValid = false
        }
        if (!validateEmail(formData.email)) {
            setErrorEmail("Debe ingresar una email de restaurante valido.")
            isValid = false
        }
        if (size(formData.phone) < 10) {
            setErrorPhone("Debe ingresar una telefono de restaurante.")
            isValid = false
        }
        if (isEmpty(formData.address)) {
            setErrorAddress("Debe ingresar una direccion de restaurante.")
            isValid = false
        }
        if (!locationRestaurant) {
            toastRef.current.show("Debes de localizar el restaurante en el mapa.", 3000)
            isValid = false
        }else if (size(imagesSelected === 0)){
            toastRef.current.show("Debes de agregar al menos una imagen al restaurante", 3000)
            isValid = false
        }
        return isValid
    }

    const clearError = () => {
        setErrorName(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorPhone(null)
        setErrorAddress(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageRestaurant
                imageRestaurant = {imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorPhone={errorPhone}
                errorAddress={errorAddress}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
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
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapRestaurant({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }) {

    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
    (async()=>{
        const response = await getCurrentLocation()
            if (response.status) {
                setNewRegion(response.location)
            }
    })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localizacion guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude : newRegion.latitude,
                                    longitude : newRegion.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar"
                        containerStyle={styles.viewMapContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar"
                        containerStyle={styles.viewMapContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={()=>setIsVisibleMap(false)}
                    />
                </View>
            </View>

        </Modal>        
    )
}

function ImageRestaurant ({imageRestaurant}) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant ? { uri : imageRestaurant } : require("../../assets/no-image.png")
                }
                style={{width : widthScreen, height : 200}}
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

function FormAdd({ formData, setFormData, errorName, errorDescription, 
                    errorEmail, errorPhone, errorAddress, setIsVisibleMap, locationRestaurant}) {
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
                placeholder="Dirección del restaurante..."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#442484" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
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
    }, 
    viewPhoto : {
        alignItems : "center",
        height : 200,
        marginBottom : 20
    }, 
    mapStyle : {
        width : "100%",
        height : 550
    }, 
    viewMapBtn : {
        flexDirection : "row",
        justifyContent : "center",
        marginTop : 10
    }, 
    viewMapContainerCancel : {
        paddingLeft : 5
    },
    viewMapContainerSave : {
        paddingRight : 5
    },
    viewMapBtnCancel : {
        backgroundColor : "#a65273"
    }, 
    viewMapBtnSave : {
        backgroundColor : "#442484"
    }
})
