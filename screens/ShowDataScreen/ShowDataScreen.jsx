import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import GetVideoData from './GetVideoData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux'
import * as stateActions from '../../store/actions/state';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ShowPicker from './ShowPicker';

const ShowDataScreen = ({ route, navigation }) => {
    const [data, setData] = useState(null)
    const [currentEpisode, setCurrentEpisode] = useState(route.params.episode)
    const [currentTime, setCurrentTime] = useState(route.params.watchData)
    const dispatch = useDispatch()

    useEffect(() => {
        if (currentTime[0] !== 0 && data) {
            dispatch(stateActions.setWatchHistory({
                link: route.params.link,
                episode: currentEpisode,
                image: route.params.img,
                time: currentTime[0],
                percentage: currentTime[1],
                title: data[1]
            }))
        }
    }, [currentTime])

    const reset = (link) => {
        // only resets time if new episode is pressed
        if (!currentEpisode || currentEpisode.link !== link) {
            setCurrentTime([0, 0])
        }
    }

    return (
        <React.Fragment>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: '#121212' }} contentContainerStyle={{ paddingBottom: 100 }}>
                <SafeAreaView style={{ width: '100%', height: hp('70%') }}>
                    <View style={styles.screen}>
                        <View style={{ width: '100%', height: '10%' }}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
                                <AntDesign name="close" color="white" size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', borderRadius: 24 }} source={{ uri: route.params.img }} />
                        </View>


                        {data ? <View style={styles.dataContainer}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.title}>{data[1]}</Text>
                                <Text style={styles.description}>{data[6].replace(/  /g, '')}</Text>
                            </View>

                            <View style={styles.tagsContainer}>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{data[4]}</Text>
                                </View>

                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{data[5].split(' ')[1].replace(',', '')}</Text>
                                </View>

                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{data[3].split(' ')[1]} min</Text>
                                </View>
                            </View>
                            {currentTime[0] > 0 && <React.Fragment>
                                <Text style={styles.currentEpText}>{currentEpisode.title}</Text>
                                <View style={styles.finishedAmountBack}>
                                    <View style={{ ...styles.finishedAmount, width: `${currentTime[1] * 100 < 5 ? 5 : currentTime[1] * 100}%` }} />
                                </View>
                            </React.Fragment>}

                        </View> : <ActivityIndicator style={{ marginTop: '20%' }} />}

                    </View>

                </SafeAreaView>
                {data && <ShowPicker currentTime={currentTime} reset={reset} setCurrentTime={(time) => setCurrentTime(time)} data={data[0]} setCurrentEpisode={(ep) => setCurrentEpisode(ep)} reset={reset} />}
            </ScrollView>
            {!data && <GetVideoData link={route.params.link} setData={(arr) => setData(arr)} />}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: '5%',
        alignItems: 'center',
        flex: 1,
    },
    imageContainer: {
        height: '35%',
        aspectRatio: .7,
        shadowColor: '#FF002E',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 30,
        marginBottom: '10%'
    },
    dataContainer: {
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
        paddingVertical: '10%',
        width: '100%'
    },
    infoContainer: {
        alignItems: 'center',
        width: '70%'
    },
    title: {
        color: 'white',
        fontFamily: 'nexaBold',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: '3%'
    },
    description: {
        color: 'gray',
        textAlign: 'center'

    },
    tagsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',

    },
    tag: {
        backgroundColor: '#404040',
        width: '30%',
        aspectRatio: 3,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagText: {
        color: 'white',
        fontFamily: 'nexaBold'
    },
    button: {
        width: '70%',
        bottom: '8%',
        aspectRatio: 5,
        borderRadius: 100,
        alignSelf: 'center',
        position: 'absolute',
        shadowColor: '#FF002E',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 30,
    },
    buttonTouchable: {
        backgroundColor: '#FF002E',
        borderRadius: 100,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'nexaBold',
        color: 'white',
        fontSize: 15
    },
    finishedAmount: {
        height: 2,
        borderRadius: 10,
        backgroundColor: '#FF002E',

    },
    finishedAmountBack: {
        height: 2,
        borderRadius: 10,
        width: '100%',
        backgroundColor: '#707070',
    },
    currentEpText: {
        color: 'white',
        fontFamily: 'nexaBold'
    }
})

/*
   <View style={styles.button} >
                <TouchableOpacity style={styles.buttonTouchable} activeOpacity={0.7} onPress={reset}>
                    <Text style={styles.buttonText}>{currentEpisode ? `Play ${currentEpisode.title}` : 'Play S1:E1'}</Text>
                </TouchableOpacity>
            </View>
*/

export default ShowDataScreen;