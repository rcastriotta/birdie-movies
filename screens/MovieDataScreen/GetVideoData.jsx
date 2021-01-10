import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const GetVideoData = (props) => {
  const ref = useRef(null)
  const handleRequests = (request) => {
    if (request.mainDocumentURL.includes('https://azm.to') || request.mainDocumentURL.includes('https://dood')) {
      return true
    }
    return false
  }


  if (props.play) {
    if (ref.current) {
      ref.current.injectJavaScript(`
      vid.webkitEnterFullscreen()
      vid.play()
      `)
    }
  }

  const redirect = `
  var e = document.querySelector(".resp-iframe");
  if(e != null) {
    const url = document.querySelector('.resp-iframe').getAttribute('src')
    const info = document.querySelector('body > div.watch-hero.gutter.flex-center.mb-large > div').innerText
    const desc = document.querySelector('body > div.watch-hero.gutter.flex-center.mb-large > div > div.hide-on-mobile.details__block.plot').innerText

      const checkExist = setInterval(function() {
        const url = e.contentWindow.document.querySelector('#my-video_html5_api > source').getAttribute('src')
        
        if (url.length) {
          window.ReactNativeWebView.postMessage(url.toString() + '~' + info + '~' + desc)
          clearInterval(checkExist);

          document.querySelector('body').innerHTML = '<video id="vid" src=""/>'
          const vid = document.querySelector('#vid')
          vid.setAttribute("src", url)

          vid.oncanplay = () => {
            vid.currentTime = ${props.currentTime[0]}
          }
          vid.ontimeupdate = (event) => {
            const percentage = vid.currentTime / vid.duration
            window.ReactNativeWebView.postMessage('TIME' + vid.currentTime + '~' + percentage)
          };
        }
      }, 100)
  }
    true; 
    `;

  return <View>
    <WebView
      ref={ref}
      source={{
        uri: `https://azm.to/${props.link}`
      }}
      onMessage={(event) => {
        if (event.nativeEvent.data.includes('TIME')) {
          const data = event.nativeEvent.data.replace('TIME', '').split('~')
          const formattedData = [parseFloat(data[0]), data[1]]
          // updates time every 10 seconds 
          if (Math.abs(formattedData[0] - props.currentTime[0]) > 10) {
            props.setCurrentTime(formattedData)
          }
          return
        }
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


/*
 const redirect = `
    const url = document.querySelector('.resp-iframe').getAttribute('src')
    const info = document.querySelector('body > div.watch-hero.gutter.flex-center.mb-large > div').innerText
    const desc = document.querySelector('body > div.watch-hero.gutter.flex-center.mb-large > div > div.hide-on-mobile.details__block.plot').innerText
    window.ReactNativeWebView.postMessage(url.toString() + '~' + info + '~' + desc)
    true;
    `;
    */