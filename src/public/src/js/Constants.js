import keyMirror from 'fbjs/lib/keyMirror';

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
  UserActionTypes: keyMirror({
    LOGIN_SUCCESS: null
  }),
  RaspberryActionTypes: keyMirror({
    GET_ALL: null,
    UPDATE_STATUS: null,
    NEW: null,
    REMOVE: null,
    DISABLE: null,
    NEW_MODULE: null
  }),

  ServiceActionTypes: keyMirror({
    SET_LIST: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })
};
