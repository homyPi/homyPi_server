import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import PlaylistAPI from '../apis/PlaylistAPI.jsx';

export default {
  loadPlaylist() {
    PlaylistAPI.loadPlaylist().then(function(playlist){
      Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.SET_PLAYLIST,
        tracks: playlist.trackset,
        idPlaying: playlist.idPlaying
      });
    }).catch(function(err) {
      
    });
  },
  clear() {
    Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.SET_PLAYLIST,
        tracks: []
    });
  },
  addTrack(track) {
    Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.ADD_TRACK,
        track: track
      });
  },
  addTrackset(trackset) {
    Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.ADD_TRACKSET,
        trackset: trackset
      });
  },
  removeTrack(_id) {
    Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.REMOVE_TRACK,
        _id: _id
      });
  },
  updatePlayingId(_id) {
    Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.UPDATE_PLAYING_ID,
        _id: _id
      });
  },
  updateProgress(progress) {
    Dispatcher.handleViewAction({
        type: Constants.PlaylistActionTypes.UPDATE_PROGRESS,
        progress: progress
      });
  }
};
