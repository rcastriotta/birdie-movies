import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const GetVideoData = (props) => {

  const handleRequests = (request) => {
    if (request.mainDocumentURL.includes('https://azm.to') || request.mainDocumentURL.includes('https://dood')) {
      return true
    }
    return false
  }

  const redirect = `
    const url = document.querySelector('.resp-iframe').getAttribute('src')
    const info = document.querySelector('body > div.watch-hero.gutter.flex-center.mb-large > div').innerText
    const desc = document.querySelector('body > div.watch-hero.gutter.flex-center.mb-large > div > div.hide-on-mobile.details__block.plot').innerText
    window.ReactNativeWebView.postMessage(url.toString() + '~' + info + '~' + desc)
    true; 
    `;

  const getLink = `
    const checkExist = setInterval(function() {
      const url = document.querySelector('#video_player_html5_api').getAttribute('src')
      
      if (url.length) {
        window.ReactNativeWebView.postMessage(url)
        clearInterval(checkExist);
      }
    }, 100)
    `;

  return <View>
    {props.data ? <WebView
      injectedJavaScript={getLink}
      source={{ uri: props.data[0] }}
      onShouldStartLoadWithRequest={handleRequests}
      onMessage={(event) => {
        props.setStream(event.nativeEvent.data)
      }}
    /> : <WebView
        source={{
          uri: `https://azm.to/${props.link}`
        }}
        onMessage={(event) => {
          const data = event.nativeEvent.data.replace(/~/g, '\n').split("\n")
          const filteredData = data.filter(item => item !== "")
          props.setData(filteredData)
        }}
        injectedJavaScript={redirect}
        onShouldStartLoadWithRequest={handleRequests}
      />}
  </View>
}

export default GetVideoData;