import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

import ModuleManager from '../ModuleManager.jsx'

// data storage
let raspberries = [];
let selected = null;
let selectedName = null;
let selectedKey = null;
var newRaspberryListeners = [];
var removeRaspberryListeners = [];
var onChangeRaspberryListeners = [];

function selectDefault() {
  if (!selected) {
    if (raspberries.length) {
      selectedName = raspberries[0].name;
      selected = raspberries[0];
      selectedKey = 0;
    } else {
      selected = null;
      selectedId = null;
      selectedKey = null;
    }
  }
}
function setRaspberries(list) {
  raspberries = [];
  for(var i = 0; i < list.length; i++) {
    addRaspberry(list[i]);
  }
  selectDefault();
}
function addRaspberry(rasp) {
  var inList = getRaspberry(rasp.name);
  if (!inList)
    raspberries.push(rasp);
}
function removeRaspberry(name) {
  for(var i = 0; i < raspberries.length; i++) {
    if (raspberries[i].name == name) {
      raspberries.splice(i, 1);
    }
  }
  if (name == selectedName) {
    selected = null;
    selectedName = null;
    selectDefault();
  }
}

function setSelected(raspberry) {
  selected = null;
  selectedName = raspberry.name;
  for(var i = 0; i < raspberries.length; i++) {
    if (raspberries[i].name == selectedName) {
      selected = raspberries[i];
      selectedKey = i;
    }
  }
  if (!selected) {
     selectDefault();
  }
}

function getRaspberry(name) {
  for(var i = 0; i < raspberries.length; i++) {
    if (raspberries[i].name === name) {
      return raspberries[i];
    }
  }
  return;
}

function newModule(data) {
  console.log("newModule", data);
  console.log("raspberries", raspberries);
  for(var i = 0; i < raspberries.length; i++) {
      if (data.socketId ===  raspberries[i].socketId) {
        raspberries[i].modules = raspberries[i].modules || {};
        raspberries[i].modules[data.module] = data;
        console.log("notify change for ", raspberries[i]);
      }
  }
}


// Facebook style store creation.
const RaspberryStore = assign({}, BaseStore, {
  getAll() {
    return {
      raspberries: raspberries,
      selectedRaspberry: raspberries[selectedKey]
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
      case Constants.RaspberryActionTypes.SET_SELECTED:
        let selectedRaspberry = action.raspberry;
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
        let nameRemoved = action.name;
        removeRaspberry(nameRemoved);
        RaspberryStore.emitChange();
        break;
      case Constants.RaspberryActionTypes.NEW_MODULE:
        newModule(action.data);
        RaspberryStore.emitChange();
        break;
      default:
        break;
      // add more cases for other actionTypes...
    }
  })
});

export default RaspberryStore;
