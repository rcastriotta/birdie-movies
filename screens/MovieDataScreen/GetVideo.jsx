import React, { useState, useRef } from 'react';
import { View } from 'react-native'
import { WebView } from 'react-native-webview';

const GetVideo = (props) => {
  const ref = useRef(null)

  if (props.play) {
    if (ref.current) {
      ref.current.injectJavaScript(`
      el.webkitEnterFullscreen()
      el.play()
      `)
    }
  }

  const script = `
    let el;
    const checkExist = setInterval(function() {
      el = document.querySelector('#vid')
      if (el) {
        el.oncanplay = () => {
          el.currentTime = ${props.currentTime[0]}
        }
        el.ontimeupdate = (event) => {
          const percentage = el.currentTime / el.duration
          window.ReactNativeWebView.postMessage(el.currentTime + '~' + percentage)
        };
        clearInterval(checkExist);
      }
    }, 100)
    `

  return (
    <View>
      <WebView
        ref={ref}
        injectedJavaScriptBeforeContentLoaded={script}
        onMessage={(event) => {
          const data = event.nativeEvent.data.split('~')
          const formattedData = [parseFloat(data[0]), data[1]]
          // updates time every 10 seconds 
          if (Math.abs(formattedData[0] - props.currentTime[0]) > 10) {
            props.setCurrentTime(formattedData)
          }
        }}
        source={{ uri: `https://movies-4cedb.web.app/?$${props.url}` }}
      />
    </View>
  )
}

export default GetVideo;