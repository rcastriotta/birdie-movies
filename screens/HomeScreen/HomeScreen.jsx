import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Switches from 'react-native-switches'
import { useSelector, useDispatch } from 'react-redux';
import * as stateActions from '../../store/actions/state';

const HomeScreen = ({ navigation }) => {
    const [newMedia, setNewMedia] = useState([])
    const mediaState = useSelector(state => state.state.mediaState)
    const dispatch = useDispatch()

    let watchHistory;

    if (mediaState) {
        watchHistory = useSelector(state => state.state.tvWatchHistory)
    } else {
        watchHistory = useSelector(state => state.state.movieWatchHistory)
    }


    useEffect(() => {
        // gets new movie list from db
        if (mediaState) {
            axios.get('https://movies-4cedb-default-rtdb.firebaseio.com/NEWTV.json').then(result => {
                setNewMedia(result.data)
            })
        } else {
            axios.get('https://movies-4cedb-default-rtdb.firebaseio.com/NEW.json').then(result => {
                setNewMedia(result.data)
            })
        }

    }, [mediaState])


    const pressHandler = (link, img) => {

        // check if link is in watch history
        const data = watchHistory.filter(movie => movie.link === link)

        const watchData = data.length === 0 ? [0, 0] : [data[0].time, data[0].percentage]

        // returns current episode if watching
        const episode = mediaState ? data.length === 0 ? null : data[0].episode : null

        // add to param
        navigation.navigate(mediaState ? 'ShowView' : 'MovieView', { link, img, watchData, episode })
    }

    const renderItem = ({ item }) => {
        let isSmall = false;
        let percentage;
        if (item.percentage) {
            isSmall = true
            percentage = `${parseInt(item.percentage * 100) < 5 ? 5 : parseInt(item.percentage * 100)}%`
        }

        return (
            <View style={isSmall ? { ...styles.item, height: '70%' } : styles.item}>
                <TouchableOpacity style={styles.poster} activeOpacity={0.7} onPress={() => pressHandler(item.link, item.image)}>
                    <Image style={{ height: '100%' }} source={{ uri: item.image }} />
                </TouchableOpacity>
                {isSmall && <View style={styles.movieInfo}>
                    <View style={{ height: '30%' }}>
                        <Text style={styles.movieTitle}>{mediaState ? item.episode.title : item.title}</Text>
                    </View>

                    <View style={styles.finishedAmountBack}>
                        <View style={{ ...styles.finishedAmount, width: percentage }} />
                    </View>
                </View>}
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.screen}>
                <View style={styles.topContainer}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.img} source={require('../../assets/logo.png')} />
                    </View>
                    <TouchableOpacity onPress={() => dispatch(stateActions.setMediaState(!mediaState))}>
                        <Switches
                            shape={'line'}
                            value={mediaState}
                            onChange={() => { }}
                            borderColor="#FF002E"
                            sliderWidth={40}
                            textOff="Movies"
                            textOn="TV"
                            textFont="nexaBold"
                            colorTextOn="#FF002E"
                            buttonColor="#FF002E"
                        />
                    </TouchableOpacity>

                </View>

                <View style={styles.newArrivals}>
                    <Text style={styles.sectionTitle}>{mediaState ? 'New Episodes' : 'New Arrivals'}</Text>
                    <FlatList showsHorizontalScrollIndicator={false} keyExtractor={item => item.link} horizontal data={newMedia} renderItem={renderItem} contentContainerStyle={{ paddingRight: 30 }} />
                </View>

                <View style={styles.continueWatching}>
                    <Text style={styles.sectionTitle}>Continue Watching</Text>
                    <FlatList showsHorizontalScrollIndicator={false} keyExtractor={item => item.link} horizontal data={watchHistory} renderItem={renderItem} contentContainerStyle={{ paddingRight: 30 }} />

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#121212',
        flex: 1,
        paddingTop: '2%'
    },
    topContainer: {
        flex: .2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: '5%',

    },
    imgContainer: {
        height: 30,
        width: 30
    },
    img: {
        height: '100%',
        width: '100%'
    },
    headerText: {
        color: '#FF002E',
        fontFamily: 'nexaBold'
    },
    newArrivals: {
        flex: 1.2,
    },
    continueWatching: {
        flex: 1,

    },
    sectionTitle: {
        fontFamily: 'nexaBold',
        color: 'white',
        marginBottom: '5%',
        marginLeft: '5%'
    },
    poster: {

        borderRadius: 24,
        overflow: 'hidden',
        width: '100%',

    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 20,
        height: '90%',
        aspectRatio: .7,
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
    movieTitle: {
        color: 'white',
        fontFamily: 'nexaReg',
        fontSize: 12
    },
    movieInfo: {
        width: '100%',
        alignSelf: 'flex-end',
        marginLeft: 20,
        height: '25%',
        justifyContent: 'space-evenly',
    }
})
export default HomeScreen;