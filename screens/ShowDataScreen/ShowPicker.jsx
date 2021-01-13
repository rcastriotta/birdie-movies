import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';


const ShowPicker = (props) => {
    const [activeTab, setActiveTab] = useState(1)
    const [link, setLink] = useState(null)
    const [loading, setLoading] = useState(false)
    const ref = useRef(null)

    const script = `
        var e = document.querySelector(".resp-iframe");
        let vid;
        const checkExist = setInterval(function() {
        if (e) {
            vid = e.contentWindow.document.querySelector('#player')
            const url = e.contentWindow.document.querySelector('#player > source').getAttribute('src')
            if (url.includes('.mkv')) {
                window.alert("Video can't be played")
                window.ReactNativeWebView.postMessage('ERROR')
                clearInterval(checkExist);
                return
            }
            window.ReactNativeWebView.postMessage('LOADING')
            vid.play()
            vid.webkitEnterFullscreen()
            vid.oncanplay = () => {
            vid.currentTime = ${props.currentTime[0]}
            }
            vid.ontimeupdate = (event) => {
                const percentage = vid.currentTime / vid.duration
                window.ReactNativeWebView.postMessage(vid.currentTime + '~' + percentage)
            };
            clearInterval(checkExist);
        }
    }, 100)
    `;


    const seasons = {}
    const data = props.data.split(',')

    data.forEach((item) => {
        const season = item.split('/')[3]
        const episode = item.split("/")[4]
        if (!seasons[season]) {
            seasons[season] = {}
        }
        seasons[season][episode] = item
    })

    const handleRequests = (request) => {
        if (request.mainDocumentURL.includes('noxx')) {
            return true
        }
        return false
    }


    const episodePressHandler = (obj) => {

        // set stream and active episode
        if (link !== obj.link) {
            props.reset(obj.link)
            props.setCurrentEpisode(obj)
            setLink(null)
            setLoading(true)
            setLink(obj.link)
        } else {
            // inject javascript
            if (ref.current) {
                ref.current.injectJavaScript(`
                vid.webkitEnterFullscreen()
                vid.play()
                `)
            }
        }
    }

    return (
        <React.Fragment>
            {Object.keys(seasons).map(key => {
                const active = parseInt(key) === activeTab
                return (
                    <View key={key} style={{ width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.season} onPress={() => setActiveTab(active ? null : parseInt(key))} activeOpacity={0.7}>
                            <Text style={styles.seasonText}>Season {key}</Text>
                            <FontAwesome5 name={active ? "angle-up" : "angle-down"} size={24} color="white" />
                        </TouchableOpacity>
                        {active && Object.keys(seasons[key]).map((ep) => {
                            return (
                                <TouchableOpacity key={ep} style={styles.episode} activeOpacity={0.7} onPress={() => episodePressHandler({ link: seasons[key][ep], title: `S${key}:E${ep}` })}>
                                    <Text style={styles.episodeText}>S{key}:E{ep}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <FontAwesome name="play-circle-o" size={20} color="#FF002E" />
                                        <Text style={styles.playText}>Play Episode</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                )
            })}
            {link && <View><WebView
                ref={ref}
                injectedJavaScript={script}
                source={{ uri: `https://noxx.is${link}` }}
                onShouldStartLoadWithRequest={handleRequests}
                onMessage={(event) => {
                    if (event.nativeEvent.data.includes('LOADING')) {
                        setLoading(false)
                        return
                    } else if (event.nativeEvent.data.includes('ERROR')) {
                        setLoading(false)
                        setLink(null)
                        return
                    }

                    const data = event.nativeEvent.data.split('~')
                    const formattedData = [parseFloat(data[0]), data[1]]

                    // updates time every 10 seconds 
                    if (Math.abs(formattedData[0] - props.currentTime[0]) > 10) {
                        props.setCurrentTime(formattedData)
                    }

                }}
            /></View>}
            <Modal visible={loading} transparent={true}><View style={styles.backdrop}><ActivityIndicator size={'large'} /></View></Modal>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    season: {
        width: '90%',
        aspectRatio: 7,
        backgroundColor: '#404040',
        borderRadius: 12,
        marginTop: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
        justifyContent: 'space-between'
    },
    seasonText: {
        fontFamily: 'nexaBold',
        color: 'white',

    },
    episode: {
        width: '85%',
        aspectRatio: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    episodeText: {
        color: 'white',
        fontFamily: 'nexaBold',
    },
    playText: {
        fontFamily: 'nexaBold',
        color: '#FF002E',
        marginLeft: '7%'
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'black',
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ShowPicker;



