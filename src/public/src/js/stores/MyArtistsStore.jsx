import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let _data = [];

// add private functions to modify data
function setMyArtists(artists) {
  _data = artists;
}

// Facebook style store creation.
const MyArtistsStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      artists: _data
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.ActionTypes.SET_MY_ARTISTS:
        let artists = action.artists || [];
        setMyArtists(artists);
        MyArtistsStore.emitChange();
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default MyArtistsStore;
