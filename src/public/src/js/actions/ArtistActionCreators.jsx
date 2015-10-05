import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import ArtistAPI from '../apis/ArtistAPI.jsx';

export default {
  getArtist(id) {
    ArtistAPI.getArtist(id).then(function(artist){
      Dispatcher.handleViewAction({
        type: Constants.ActionTypes.SET_ARTIST,
        artist: artist
      });
    }).catch(function(err) {
      
    });
  }
};
