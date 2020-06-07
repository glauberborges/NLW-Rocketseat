import React, {useEffect, useState} from 'react';
import Constants from "expo-constants";
import api from "../../services/api";
import * as MailComposer from 'expo-mail-composer';
import { StyleSheet, View, Image, Text,TouchableOpacity, SafeAreaView, Linking} from 'react-native';
import { Feather as Icon, FontAwesome }  from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

interface ParamsInterface {
    point_id: number
}
interface DataInterface {
    point: {
        image: string,
        image_url: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        number: string,
        uf: string,
    },
    items: {
        title: string
    }[],
}


const Details = () => {

    const route     = useRoute()
    const [data, setData]     = useState<DataInterface>( {} as DataInterface )
    const params    = route.params as ParamsInterface;

    useEffect(function () {
        api.get(`points/${params.point_id}`).then(function (response) {
            setData(response.data)
        })
    },[])


    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Ubuntu_700Bold,
    });

    const navigation = useNavigation();

    //
    // function handleNaigationDetails() {
    //     navigator
    // }

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleWhatsApp() {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Gostaria de mais informação sobre a coleta`)
    }

    function handleComposerMail() {
        MailComposer.composeAsync({
            subject: 'Gostaria de mais informação sobre a coleta',
            recipients: [data.point.email],
        })
    }

    if (!fontsLoaded || !data.point) {
        return <AppLoading />;
    } else {
        return (
            <SafeAreaView style={{
                flex: 1
            }}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={handleNavigateBack}>
                        <Icon name='arrow-left'  color='#34CB79' size={20} />
                    </TouchableOpacity>

                    <Image style={styles.pointImage} source={{ uri: data.point.image_url }}/>


                    <Text style={styles.pointName}> {data.point.name}  </Text>

                    <Text style={styles.pointItems}>

                        {data.items.map(item => item.title).join(', ')}
                    </Text>



                    <View>
                        <Text style={styles.addressTitle} > Endereço </Text>
                        <Text style={styles.addressContent} > {data.point.city} / {data.point.uf} </Text>
                    </View>

                </View>

                <View style={styles.footer}>
                    <RectButton style={styles.button}  onPress={ ()=> { handleWhatsApp() } } >
                        <Text> <FontAwesome name='whatsapp'  color='#fff' size={20} />  </Text>

                        <Text style={styles.buttonText}> WhatsApp </Text>
                    </RectButton>

                    <RectButton style={styles.button}  onPress={ ()=> { handleComposerMail() } } >
                        <Text> <Icon name='mail'  color='#fff' size={20} />  </Text>

                        <Text style={styles.buttonText}> E-mail </Text>
                    </RectButton>
                </View>



            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,

    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 32,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});

export default Details;