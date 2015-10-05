import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let _data = {albums: {}, tracks: {}, artists: {}};


function setList(resTracks, resAlbums, resArtists) {
  _data = {albums: resAlbums, tracks: resTracks, artists: resArtists};
}
// Facebook style store creation.
const MusicSearchStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      tracks: _data.tracks,
      albums: _data.albums,
      artists: _data.artists
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.MusicSearchActionTypes.SET_RESULTS:
      try {
        let {tracks, albums, artists} = action.results;
        setList(tracks, albums, artists);
        MusicSearchStore.emitChange();
      } catch(e) {
        console.log(e);
        console.log(e.stack);
      }
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default MusicSearchStore;
