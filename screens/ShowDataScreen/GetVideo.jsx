import React, { useState, useRef } from 'react';
import { View, Alert, Modal, Text, StyleSheet, Button } from 'react-native'
import { WebView } from 'react-native-webview';

const GetVideo = (props) => {
  const ref = useRef(null)
  const isMKV = props.url.includes('.mkv')

  if (props.play) {
    if (ref.current) {
      ref.current.injectJavaScript(`
      el.webkitEnterFullscreen()
      el.play()
      `)
    }
  }


  let script = `
    let el;
    const checkExist = setInterval(function() {
      el = document.querySelector('body > video')
      if (el) {
        el.webkitEnterFullscreen()
        el.play()
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



  if (isMKV) {
    return (
      <Modal transparent={true}><View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.alertText}>Can't Play Title</Text>
          <Button title="Okay" onPress={props.reset} />
        </View>
      </View>
      </Modal>
    )
  }

  return (
    <View>
      <WebView
        style={{ width: 500, height: 500 }}
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
        source={{ uri: props.url.replace('\n', '') }}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'background: rgba(0, 0, 0, 0.4)',
  },
  container: {
    width: '70%',
    aspectRatio: 2,
    backgroundColor: '#404040',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '6%'
  },
  alertText: {
    fontFamily: 'nexaBold',
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    paddingHorizontal: '5%'

  }
})

export default GetVideo;