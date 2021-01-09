// TYPES
export const SET_COOKIE_TIME = 'SET_COOKIE_TIME'
export const SET_WATCH_HISTORY = 'SET_WATCH_HISTORY'
export const SET_MEDIA_STATE = 'SET_MEDIA_STATE'

export const setCookie = () => {
    return (dispatch) => {
        dispatch({ type: SET_COOKIE_TIME, time: new Date() })
    }
}


export const setWatchHistory = (data) => {
    return (dispatch) => {
        dispatch({ type: SET_WATCH_HISTORY, data })
    }
}

export const setMediaState = (state) => {
    return (dispatch) => {
        dispatch({ type: SET_MEDIA_STATE, state })
    }
}