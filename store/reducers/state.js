import { SET_COOKIE_TIME, SET_WATCH_HISTORY, SET_MEDIA_STATE } from '../actions/state';

const initialState = {
    tvCookiesSet: null,
    movieCookiesSet: null,
    movieWatchHistory: [],
    tvWatchHistory: [],
    mediaState: false // false is movie, true is tv
}

const findInArray = (array, attr, value) => {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

const stateReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COOKIE_TIME:
            if (state.mediaState) {
                return {...state, tvCookiesSet: action.time }
            }
            return {...state, movieCookiesSet: action.time }
        case SET_WATCH_HISTORY:
            // check if watch data is already present
            let key;

            if (state.mediaState) {
                key = 'tvWatchHistory'
            } else {
                key = 'movieWatchHistory'
            }
            const copy = [...state[key]]
            const index = findInArray(copy, 'link', action.data.link)
            if (index !== -1) {
                copy.splice(index, 1)
            }
            copy.unshift(action.data)

            return {...state, [key]: copy }
        case SET_MEDIA_STATE:
            return {...state, mediaState: action.state }
        default:
            return state
    }
}

export default stateReducer;