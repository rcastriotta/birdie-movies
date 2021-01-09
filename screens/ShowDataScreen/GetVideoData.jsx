import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const GetVideoData = (props) => {
    const handleRequests = (request) => {
        if (request.mainDocumentURL.includes('noxx')) {
            return true
        }
        return false
    }

    const redirect = `
    const episodes = []
    document.querySelectorAll('.episodes__episode').forEach((el) => episodes.push(el.getAttribute('href')))
    const info = document.querySelector('body > main > div.watch-hero.gutter.flex-center.mb-large > div').innerText
    const desc = document.querySelector('body > main > div.watch-hero.gutter.flex-center.mb-large > div > div.hide-on-mobile.details__block.plot').innerText
    window.ReactNativeWebView.postMessage(episodes + '~' + info + '~' + desc)
    true; 
    `;


    return <View>
        <WebView
            source={{
                uri: `https://noxx.is${props.link}`
            }}
            onMessage={(event) => {
                const data = event.nativeEvent.data.replace(/~/g, '\n').split("\n")
                const filteredData = data.filter(item => item !== "")
                props.setData(filteredData)
            }}
            injectedJavaScript={redirect}
            onShouldStartLoadWithRequest={handleRequests}
        />
    </View>
}

export default GetVideoData;