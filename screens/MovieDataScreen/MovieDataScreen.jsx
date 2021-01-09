import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import GetVideoData from './GetVideoData';
import GetVideo from './GetVideo';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux'
import * as stateActions from '../../store/actions/state';


const MovieDataScreen = ({ route, navigation }) => {
    const [data, setData] = useState(null)
    const [streamURL, setStreamURL] = useState(false)
    const [showVideo, setShowVideo] = useState(false)
    const [currentTime, setCurrentTime] = useState(route.params.watchData)
    const dispatch = useDispatch()

    useEffect(() => {
        if (currentTime[0] !== 0 && data) {
            dispatch(stateActions.setWatchHistory({
                link: route.params.link,
                image: route.params.img,
                time: currentTime[0],
                percentage: currentTime[1],
                title: data[1]
            }))
        }
    }, [currentTime])

    const reset = () => {
        setShowVideo(false)
        setTimeout(() => {
            setShowVideo(true)
        }, 10)
    }

    return (
        <React.Fragment>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
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
                                <Text style={styles.tagText}>{data[5].split(' ')[1]}</Text>
                            </View>

                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{data[3].split(' ')[1]} min</Text>
                            </View>
                        </View>
                        {currentTime[0] > 0 && <View style={styles.finishedAmountBack}>
                            <View style={{ ...styles.finishedAmount, width: `${currentTime[1] * 100 < 5 ? 5 : currentTime[1] * 100}%` }} />
                        </View>}

                        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={reset}>
                            <Text style={styles.buttonText}>{currentTime[0] > 0 ? 'Resume Movie' : 'Start Movie'}</Text>
                        </TouchableOpacity>
                    </View> : <ActivityIndicator style={{ marginTop: '20%' }} />}


                </View>

            </SafeAreaView>
            {streamURL.length ? <React.Fragment>
                <GetVideo play={showVideo} currentTime={currentTime} setCurrentTime={(time) => setCurrentTime(time)} url={streamURL} />
            </React.Fragment> : <React.Fragment>
                    <GetVideoData link={route.params.link} data={data} setData={(arr) => setData(arr)} setStream={(url) => setStreamURL(url)} />
                </React.Fragment>
            }
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
        width: '100%',
        aspectRatio: 6,
        backgroundColor: '#FF002E',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
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
})

export default MovieDataScreen;