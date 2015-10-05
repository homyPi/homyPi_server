import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let artist = {
  albums: [],
  name: "",
  top_tracks: []
};

// add private functions to modify data
function setData(newArtist) {
  artist = newArtist;
}
const ArtistStore = assign({}, BaseStore, {
  getAll() {
    return {
      artist: artist
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.ActionTypes.SET_ARTIST:
        let newArtist = action.artist;
        setData(newArtist);
        console.log(newArtist);
        ArtistStore.emitChange();
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default ArtistStore;
