import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';


const ShowPicker = (props) => {
    const [activeTab, setActiveTab] = useState(1)
    const [links, setLinks] = useState({
        activeLink: null,
        frameLink: null
    })

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
        props.reset(obj.link)
        setLinks({ activeLink: null, frameLink: null })
        props.setCurrentEpisode(obj)

        // initialize webview
        setLinks(prev => ({ ...prev, activeLink: obj.link }))
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
            {links.activeLink && <WebView
                injectedJavaScript={getiFrameLink}
                source={{ uri: `https://noxx.is${links.activeLink}` }}
                onShouldStartLoadWithRequest={handleRequests}
                onMessage={(event) => {
                    setLinks({
                        activeLink: null,
                        frameLink: event.nativeEvent.data
                    })
                }}
            />}
            {links.frameLink && <WebView
                style={{ width: 500 }}
                injectedJavaScript={getLink}
                source={{ uri: `https://noxx.is${links.frameLink}` }}
                onShouldStartLoadWithRequest={handleRequests}
                onMessage={(event) => {
                    setLinks({ ...links, frameLink: null })
                    props.setStreamURL(event.nativeEvent.data)
                }}
            />}
            <Modal visible={links.activeLink || links.frameLink ? true : false} transparent={true}><View style={styles.backdrop}><ActivityIndicator size={'large'} /></View></Modal>
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

const getiFrameLink = `
    const checkExist = setInterval(function() {
      const url = document.querySelector('.resp-iframe').getAttribute('src')

      if (url) {
        window.ReactNativeWebView.postMessage(url)
        clearInterval(checkExist);
      }
    }, 100)
    `;

const getLink = `
        const el = document.querySelector('#player > source')
        const url = el.getAttribute('src')
        window.ReactNativeWebView.postMessage(url)
    `

