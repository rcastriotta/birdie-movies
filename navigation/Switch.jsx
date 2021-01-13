import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as stateActions from '../store/actions/state';
import { WebView } from 'react-native-webview';
import MainNav from './MainNavigator';
import { NavigationContainer } from '@react-navigation/native';

const Switch = () => {
    const dispatch = useDispatch()
    const mediaState = useSelector(state => state.state.mediaState)
    const [cookies, setCookies] = useState(null)

    const d = new Date()
    let needsCookieUpdate;
    let url;

    if (mediaState) {
        const cookieSetTime = useSelector(state => state.state.tvCookiesSet)
        needsCookieUpdate = !cookieSetTime || d - Date.parse(cookieSetTime) > 43200000
        url = 'https://movies-4cedb-default-rtdb.firebaseio.com/COOKIESTV.json'
    } else {
        const cookieSetTime = useSelector(state => state.state.movieCookiesSet)
        needsCookieUpdate = !cookieSetTime || d - Date.parse(cookieSetTime) > 43200000
        url = 'https://movies-4cedb-default-rtdb.firebaseio.com/COOKIES.json'
    }

    const cookieScript = `
    let cookies = '${cookies}'
    cookies = cookies.match(/[^,]+,[^,]+/g)

    function setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  
    cookies.forEach((cookie) => {
      cookie = cookie.split(',')
      setCookie(cookie[0], cookie[1], 3)
    })
    window.ReactNativeWebView.postMessage('Done')
    true
    `

    useEffect(() => {
        if (needsCookieUpdate) {
            axios.get(url).then(result => {
                const newCookies = []
                result.data.forEach(cookie => {
                    newCookies.push([cookie.name, cookie.value])
                })
                setCookies(newCookies)
            })
        }
    }, [])


    if (needsCookieUpdate) {
        return (
            <React.Fragment>
                <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator />
                </View>
                <View>
                    {cookies && <WebView
                        injectedJavaScriptBeforeContentLoaded={cookieScript}
                        source={{
                            uri: mediaState ? 'https://noxx.is/' : 'https://azm.to/'
                        }}
                        onMessage={() => {
                            dispatch(stateActions.setCookie())
                        }}
                    />}
                </View>
            </React.Fragment>
        )
    }

    // this would be main navigator
    return (
        <NavigationContainer>
            <MainNav />
        </NavigationContainer>
    )
}

export default Switch;