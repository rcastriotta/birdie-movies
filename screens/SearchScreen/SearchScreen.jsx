import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import GetSearchResults from './GetSearchResults';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchScreen = ({ navigation }) => {
    const [results, setResults] = useState([])
    const [searchParam, setSearchParam] = useState(null)
    const [loading, setLoading] = useState(false)
    const mediaState = useSelector(state => state.state.mediaState)

    let watchHistory;

    if (mediaState) {
        watchHistory = useSelector(state => state.state.tvWatchHistory)
    } else {
        watchHistory = useSelector(state => state.state.movieWatchHistory)
    }
    useEffect(() => {
        if (!searchParam) {
            setLoading(false)
        }
    }, [searchParam])

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
        if (!item.link || !item.image || !item.title) {
            return
        }
        return (
            <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => pressHandler(item.link, item.image)}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={{ height: '100%', borderRadius: 20 }} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.playMovie}>
                        <FontAwesome name="play-circle-o" size={20} color="#FF002E" />
                        <Text style={styles.playMovieText}>{mediaState ? 'Play Show' : 'Play Movie'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <React.Fragment>
            <SafeAreaView style={{ backgroundColor: '#121212', flex: 1 }}>
                <View style={styles.screen}>
                    <View style={styles.searchBar}>
                        <AntDesign name="search1" size={24} color="#5B5B5B" />
                        <TextInput
                            selectionColor="#FF002E"
                            placeholder={mediaState ? 'Search TV Shows' : 'Search Movies'}
                            placeholderTextColor="white"
                            style={styles.input}
                            keyboardAppearance="dark"
                            autoCorrect={false}
                            onChangeText={(text) => setSearchParam(mediaState ? text ? text.replace(/ /g, '%20') : null : text ? text.replace(/ /g, '-') : null)}
                        />
                    </View>
                    {searchParam && !loading ? <FlatList renderItem={renderItem} showsVerticalScrollIndicator={false} keyExtractor={item => item.link} data={results} contentContainerStyle={{ paddingTop: 25 }} /> : null}
                    {loading && <ActivityIndicator style={{ marginTop: 50 }} />}
                </View>
            </SafeAreaView>
            {searchParam && <GetSearchResults mediaState={mediaState} setLoading={(value) => setLoading(value)} param={searchParam} setResults={(res) => setResults(res)} />}
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%'
    },
    searchBar: {
        width: '100%',
        aspectRatio: 8,
        backgroundColor: '#303030',
        borderRadius: 13,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '5%'
    },
    item: {
        width: '100%',
        aspectRatio: 2.5,
        flexDirection: 'row',
        marginTop: 10
    },
    imageContainer: {
        height: '100%',
        aspectRatio: .7,
    },
    textContainer: {
        paddingTop: '5%',
        paddingHorizontal: '5%'
    },
    title: {
        fontFamily: 'nexaBold',
        color: 'white',
        fontSize: 15
    },
    input: {
        color: 'white',
        marginLeft: '5%',
        fontFamily: 'nexaReg',
        width: '100%'
    },
    playMovie: {
        flexDirection: 'row',
        marginTop: '10%',
        alignItems: 'baseline',
    },
    playMovieText: {
        fontFamily: 'nexaBold',
        color: '#FF002E',
        marginLeft: 10
    }
})

export default SearchScreen;