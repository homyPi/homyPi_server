import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let _data = [];
let playing = null;
let progress = {
  minutes: "0",
  seconds: "00",
  progressMs: 0
};
// add private functions to modify data
function addItem(_id, name, uri, artists=[], album={}, durationMs) {
    var durationStr = Math.floor((durationMs % 3600000) / 60000) + ":" + Math.floor(((durationMs % 360000) % 60000) / 1000);
    _data.push({_id, name, uri, artists,album,durationMs, durationStr});
}
function setList(tracks) {
  _data = []
  tracks.forEach(function(track) {
      addItem(track._id, track.name, track.uri, track.artists, track.album, track.duration_ms);
  });
}
function removeItemById(_id) {
  for(var i = 0; i < _data.length; i++) {
    if (_data[i]._id === _id) {
      _data.splice(i, 1)
      break;
    }
  }
}
function setPlaying(idPlaying) {
  _data.forEach(function(track) {
    if (idPlaying == track._id) {
      playing = track;
    }
  });
}
function setProgress(newProgress) {
  progress = {
    minutes: Math.floor((newProgress % 3600000) / 60000),
    seconds: Math.floor(((newProgress % 360000) % 60000) / 1000),
    progressMs: newProgress
  }
  if (progress.seconds < 10) {
    progress.seconds = "0" + progress.seconds
  }
}


// Facebook style store creation.
const PlaylistStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      tracks: _data,
      playing: playing,
      progress: progress
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.PlaylistActionTypes.SET_PLAYLIST:
        let {tracks, idPlaying} = action;
        setList(tracks);
        setPlaying(idPlaying);
        PlaylistStore.emitChange();
        break;
      case Constants.PlaylistActionTypes.ADD_TRACK:
        let track = action.track;
        addItem(track._id, track.name, track.uri, track.artists, track.album, track.duration_ms);
        PlaylistStore.emitChange();
        break;
      case Constants.PlaylistActionTypes.ADD_TRACKSET:
        let trackset = action.trackset;
        trackset.forEach(function(track) {
          addItem(track._id, track.name, track.uri, track.artists, track.album, track.duration_ms);
        })
        PlaylistStore.emitChange();
        break;
      case Constants.PlaylistActionTypes.REMOVE_TRACK:
        let _idRemoved = action._id;
        removeItemById(_idRemoved);
        PlaylistStore.emitChange();
        break;
      case Constants.PlaylistActionTypes.UPDATE_PLAYING_ID:
        let _idUpdated = action._id;
        setPlaying(_idUpdated);
        setProgress(0);
        PlaylistStore.emitChange();
        break;
      case Constants.PlaylistActionTypes.UPDATE_PROGRESS:
        let newProgress = action.progress;
        setProgress(newProgress);
        PlaylistStore.emitChange();
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default PlaylistStore;
