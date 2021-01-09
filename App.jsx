import React from 'react';
import Switch from './navigation/Switch';
import * as Font from 'expo-font';

// REDUX
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/integration/react'
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'

// reducers
import stateReducer from './store/reducers/state';

// handle screen glitch
import { enableScreens } from 'react-native-screens';
enableScreens();

const statePersistConfig = {
  key: 'state',
  storage: AsyncStorage
}

const rootReducer = combineReducers({
  state: persistReducer(statePersistConfig, stateReducer)
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store)

// TO PREVENT ANY YELLOW WARNINGS -----------
console.disableYellowBox = true;



export default function App() {
  const [loaded] = Font.useFonts({
    nexaReg: require('./assets/fonts/nexa-regular.otf'),
    nexaBold: require('./assets/fonts/nexa-bold.otf')
  })

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <Switch />
      </PersistGate>
    </Provider >
  )
}
