import keyMirror from 'react/lib/keyMirror';

export default {
  // event name triggered from store, listened to by views
  CHANGE_EVENT: 'change',

  // Each time you add an action, add it here... They should be past-tense
  ActionTypes: keyMirror({
    ALARM_ADDED: null,
    SET_ALARMS: null,
    DELETE_ALARM: null,
    ADD_ALARM: null,
    UPDATE_ALARM: null,
    SET_ARTIST: null,
    SET_MY_ARTISTS: null
  }),
  MusicSearchActionTypes: keyMirror({
    SET_RESULTS: null
  }),
  PlaylistActionTypes: keyMirror({
    SET_PLAYLIST: null,
    ADD_TRACK: null,
    ADD_TRACKSET: null,
    REMOVE_TRACK: null,
    UPDATE_PLAYING_ID: null,
    UPDATE_PROGRESS: null
  }),
  UserActionTypes: keyMirror({
    LOGIN_SUCCESS: null
  }),
  RaspberryActionTypes: keyMirror({
    GET_ALL: null,
    UPDATE_STATUS: null,
    NEW: null,
    REMOVE: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })
};
