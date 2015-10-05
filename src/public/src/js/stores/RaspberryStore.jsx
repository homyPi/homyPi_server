import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let raspberries = [];
let selected = null;
let selectedId = null;

function selectDefault() {
  if (!selected) {
    if (raspberries.length) {
      selectedId = raspberries[0].socketId;
      selected = raspberries[0];
    } else {
      selected = null;
      selectedId = null;
    }
  }
}
function setRaspberries(list) {
  raspberries = list;
  selectDefault();
}
function addRaspberry(rasp) {
  raspberries.push(rasp);
}
function removeRaspberry(socketId) {
  for(var i = 0; i < raspberries.length; i++) {
    if (raspberries[i].socketId == socketId) {
      raspberries.splice(i, 1);
    }
  }
  if (socketId == selectedId) {
    selected = null;
    selectedId = null;
    selectDefault();
  }
}
function updateStatus(socketId, status) {
  for(var i = 0; i < raspberries.length; i++) {
    if (raspberries[i].socketId == socketId) {
      raspberries[i].status = status;
    }
  }
}
function setSelected(raspberry) {
  selected = null;
  selectedId = raspberry.socketId;
  for(var i = 0; i < raspberries.length; i++) {
    if (raspberries[i].socketId == selectedId) {
      selected = raspberries[i];
    }
  }
  if (!selected) {
     selectDefault();
  }
}
// Facebook style store creation.
const RaspberryStore = assign({}, BaseStore, {
  getAll() {
    return {
      raspberries: raspberries,
      selectedRaspberry: selected
    };
  },

  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.RaspberryActionTypes.GET_ALL:
        let list = action.list;
        setRaspberries(list);
        RaspberryStore.emitChange();
        break;
      case Constants.RaspberryActionTypes.UPDATE_STATUS:
        let socketIdUpdated = action.socketId;
        let status = action.status;
        updateStatus(socketIdUpdated, status);
        RaspberryStore.emitChange();
        break;
      case Constants.RaspberryActionTypes.SET_SELECTED:
        let selectedRaspberry = action.selectedRaspberry;
        setSelected(selectedRaspberry);
        RaspberryStore.emitChange();
        break;
      case Constants.RaspberryActionTypes.NEW:
        let raspberry = action.raspberry;
        addRaspberry(raspberry);
        selectDefault();
        RaspberryStore.emitChange();
        break;
      case Constants.RaspberryActionTypes.REMOVE:
        let socketIdRemoved = action.socketId;
        removeRaspberry(socketIdRemoved);
        RaspberryStore.emitChange();
        break;
      default:
        break;
      // add more cases for other actionTypes...
    }
  })
});

export default RaspberryStore;
