import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import { loadingErrorReducer, normalizrEntityReducer, normalizrResultReducer } from '../utils';
import { getVideoList$, refreshVideoList$, getOneVideo$ } from './videos.service';

// Actions
const prefix = 'vod/videos/';

const LOAD_VIDEOS_START = `${prefix}LOAD_VIDEOS_START`;
const LOAD_VIDEOS_SUCCESS = `${prefix}LOAD_VIDEOS_SUCCESS`;
const LOAD_VIDEOS_ERROR = `${prefix}LOAD_VIDEOS_ERROR`;

const REFRESH_VIDEOS_START = `${prefix}REFRESH_VIDEOS_START`;
const REFRESH_VIDEOS_SUCCESS = `${prefix}REFRESH_VIDEOS_SUCCESS`;
const REFRESH_VIDEOS_ERROR = `${prefix}REFRESH_VIDEOS_ERROR`;

const LOAD_VIDEO_START = `${prefix}LOAD_VIDEO_START`;
const LOAD_VIDEO_SUCCESS = `${prefix}LOAD_VIDEO_SUCCESS`;
const LOAD_VIDEO_ERROR = `${prefix}LOAD_VIDEO_ERROR`;

const SEARCH = `${prefix}SEARCH`;

const SORT = `${prefix}SORT`;

// Action creators
export const loadVideosStart = () => ({ type: LOAD_VIDEOS_START });
export const loadVideosSuccess = (payload) => ({ type: LOAD_VIDEOS_SUCCESS, payload });
export const loadVideosError = (payload) => ({ type: LOAD_VIDEOS_ERROR, payload });

export const refreshVideosStart = () => ({ type: REFRESH_VIDEOS_START });
export const refreshVideosSuccess = (payload) => ({ type: REFRESH_VIDEOS_SUCCESS, payload });
export const refreshVideosError = (payload) => ({ type: REFRESH_VIDEOS_ERROR, payload });

export const loadVideoStart = (payload) => ({ type: LOAD_VIDEO_START, payload });
export const loadVideoSuccess = (payload) => ({ type: LOAD_VIDEO_SUCCESS, payload });
export const loadVideoError = (payload) => ({ type: LOAD_VIDEO_ERROR, payload });

export const search = (payload) => ({ type: SEARCH, payload });

export const sort = (payload) => ({ type: SORT, payload });

// Reducers
export const oneVideoReducer = loadingErrorReducer(LOAD_VIDEO_START, LOAD_VIDEO_SUCCESS, LOAD_VIDEO_ERROR);
export const videoListReducer = loadingErrorReducer(LOAD_VIDEOS_START, LOAD_VIDEOS_SUCCESS, LOAD_VIDEOS_ERROR);
export const videoListRefreshReducer = loadingErrorReducer(REFRESH_VIDEOS_START, REFRESH_VIDEOS_SUCCESS, REFRESH_VIDEOS_ERROR);
export const videoEntitiesReducer = normalizrEntityReducer('videos', [LOAD_VIDEOS_SUCCESS, REFRESH_VIDEOS_SUCCESS], LOAD_VIDEO_SUCCESS);
export const videoResultReducer = normalizrResultReducer([LOAD_VIDEOS_SUCCESS, REFRESH_VIDEOS_SUCCESS], LOAD_VIDEO_SUCCESS);
export const initializedReducer = (state = false, action = {}) => {
    switch (action.type) {
        case LOAD_VIDEOS_SUCCESS:
        case LOAD_VIDEOS_ERROR: {
            return true;
        }
        default: {
            return state;
        }
    }
};

export const searchReducer = (state = '', action = {}) => {
    switch (action.type) {
        case SEARCH: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export const sortReducer = (state = { col: '', dir: '' }, action = {}) => {
    switch (action.type) {
        case SORT: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const reducer = combineReducers({
    one: oneVideoReducer,
    list: videoListReducer,
    listRefresh: videoListRefreshReducer,
    entities: videoEntitiesReducer,
    result: videoResultReducer,
    initialized: initializedReducer,
    search: searchReducer,
    sort: sortReducer,
});

export default reducer;

// Epics
export const loadVideosList$ = action$ =>
    action$.ofType(LOAD_VIDEOS_START)
        .switchMap(() => getVideoList$())
            .map((res) => loadVideosSuccess(res))
            .catch((err) => Observable.of(loadVideosError(err)));

export const reloadVideoList$ = action$ =>
    action$.ofType(REFRESH_VIDEOS_START)
        .switchMap(() => refreshVideoList$())
            .map((res) => refreshVideosSuccess(res))
            .catch((err) => Observable.of(refreshVideosError(err)));

export const loadOneVideo$ = action$ =>
    action$.ofType(LOAD_VIDEO_START)
        .switchMap(({ payload }) => getOneVideo$(payload))
            .map((res) => loadVideoSuccess(res))
            .catch((err) => Observable.of(loadVideoError(err)));

export const videosEpics = combineEpics(
    loadVideosList$,
    reloadVideoList$,
    loadOneVideo$,
);
