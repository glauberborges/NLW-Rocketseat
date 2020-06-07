import React ,{useState, useEffect} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { AppLoading } from 'expo';
import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Feather as Icon }  from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import MapView, { Marker }from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location';

interface Items {
    id: number,
    title: string,
    image_url: string,
}

interface PointInterface {
    id: number,
    name: string,
    image: string,
    image_url: string,
    latitude: number,
    longitude: number,
}

interface ParamsInterface {
    uf: string,
    city: string,
}

const Points = () => {

    const [items, setItems]                     = useState<Items[]>([]);
    const [selectedItems ,setSelectedItems]     = useState<number[]>([]);
    const [initPosition, setInitPosition]       = useState<[number, number]>([0, 0]);
    const [points, setPoints]                 = useState<PointInterface[]>([]);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as ParamsInterface

    useEffect(function () {
        api.get('/items').then(function (respose) {
            setItems(respose.data)

        })
    },[])

    useEffect(function () {
        async  function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Erro', 'Precisamos da sua localização para prosseguir.')
                return;
            }

            const location = await Location.getCurrentPositionAsync({});

            const {latitude, longitude} = location.coords;

            await setInitPosition([latitude, longitude]);
        }

        loadPosition();

    },[])

    useEffect(function () {

        api.get('/points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems,
            }
        }).then(function (respose) {
            setPoints(respose.data)
        })
    },[selectedItems])

    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Ubuntu_700Bold,
    });



    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateDetail(id:number) {
        navigation.navigate('Detail', {point_id: id})
    }

    function handleSelectItems(id: number) {

        if (selectedItems.includes(id)){
            setSelectedItems(
                selectedItems.filter((item)=>(item !== id))
            )
        }else{
            setSelectedItems([
                ...selectedItems,
                id
            ])
        }
    }
    

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name='arrow-left'  color='#34CB79' size={20} />
                </TouchableOpacity>

                <Text style={styles.title}>😀 Bem vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>

                    { initPosition[0] !== 0 && (
                        <MapView style={styles.map}
                             initialRegion={{
                                 latitude: initPosition[0],
                                 longitude: initPosition[1],
                                 latitudeDelta: 0.014,
                                 longitudeDelta: 0.014,
                             }}
                        >
                            {points.map(point => (
                                    <Marker
                                        key={String(point.id)}
                                        onPress={ () => handleNavigateDetail(point.id) }
                                        style={styles.mapMarker}
                                        coordinate={{
                                            latitude: point.latitude,
                                            longitude: point.longitude,
                                            // latitude: -23.2177019,
                                            // longitude: -47.5211753,

                                        }}>
                                        <View style={styles.mapMarkerContainer}>
                                            <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }}/>
                                            <Text style={styles.mapMarkerTitle}> {point.name}</Text>
                                        </View>
                                    </Marker>
                                ))}


                        </MapView>
                    )}


                </View>
            </View>

            <Text style={styles.descriptionItems}> Deslize para ver mais opções.</Text>

            <View style={styles.itemsContainer}>
                <ScrollView horizontal>
                    {items.map( item => (
                        <TouchableOpacity key={String(item.id)} style={[
                            styles.item,
                            selectedItems.includes(item.id)  ? styles.selectedItem : {}
                        ]} onPress={ () => { handleSelectItems(item.id)} }>

                            <SvgUri width={42} height={42} uri={item.image_url}/>
                            <Text style={styles.itemTitle} > {item.title}</Text>

                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>


            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    descriptionItems: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 30,
        paddingHorizontal: 32,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 32,
        marginBottom: 32,
        alignItems: 'center',
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;