import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const GetSearchResults = (props) => {
    const handleRequests = (request) => {
        if (request.mainDocumentURL.includes('https://azm.to') || request.mainDocumentURL.includes('https://dood') || request.mainDocumentURL.includes('https://noxx')) {
            return true
        }
        return false
    }

    const getResults = `
    let el;
    const checkExist = setInterval(function() {
        el = document.querySelector('body')
      if (el) {
          const links = [];
          const images = [];
          const titles = [];

          if (document.querySelector('.poster__link')) {
            document.querySelectorAll('.poster__link').forEach(el => links.push(el.getAttribute('href')))
            document.querySelectorAll('.poster__img').forEach(el => images.push(el.getAttribute('data-src')))
            document.querySelectorAll('.title').forEach(el => titles.push(el.innerText))
          }
          window.ReactNativeWebView.postMessage(links + '~' + images + '~' + titles)
         
        clearInterval(checkExist);
      }
    }, 100)
    `
    return (
        <View>
            <WebView
                injectedJavaScript={getResults}
                onLoadStart={() => props.setLoading(true)}
                source={{ uri: props.mediaState ? `https://noxx.is/browse?q=${props.param}` : `https://azm.to/search/${props.param}` }}
                onShouldStartLoadWithRequest={handleRequests}
                onMessage={(event) => {
                    const data = event.nativeEvent.data.split('~')
                    const links = data[0].split(',').slice(0, 20)
                    const images = data[1].split(',').slice(0, 20)
                    const titles = data[2].split(',').slice(0, 20)

                    props.setResults(links.map((link, i) => {
                        return { link, image: images[i], title: titles[i] }
                    }))
                    props.setLoading(false)
                }}
            />
        </View>
    )
}

export default GetSearchResults;