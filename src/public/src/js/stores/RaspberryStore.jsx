import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

import ModuleManager from '../ModuleManager.jsx';
console.log(ModuleManager);
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
  console.log("DEFAULT CHANGED!!!!", ModuleManager);
  ModuleManager.notifyRaspberryEvent(ModuleManager.RASPBERRY_EVENTS.SELECTED_CHANGED, {
    selected : selected
  });
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
  ModuleManager.notifyRaspberryEvent(ModuleManager.RASPBERRY_EVENTS.DISCONNECTED, {
    name: name
  });
}
function disableRaspberry(name) {
  let rasp = getRaspberry(name);
  if (rasp) {
    rasp.status = "DOWN";
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
        console.log("RASPBERRY_STORE GOT ALL!!");

        try {
        let list = action.list;
        setRaspberries(list);
        console.log("RASPBERRY_STORE IS EMMITING!!");
          RaspberryStore.emitChange();
        } catch(e) {
          console.log(e);
          console.log(e.stack);
        }
        break;
      case Constants.RaspberryActionTypes.SET_SELECTED:
        let selectedRaspberry = action.raspberry;
        setSelected(selectedRaspberry);
        RaspberryStore.emitChange();
        break;
      case Constants.RaspberryActionTypes.NEW:
        console.log("RASPBERRY_STORE NEWWWWWWWW");
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
      case Constants.RaspberryActionTypes.DISABLE:
        let nameDisable = action.name;
        disableRaspberry(nameDisable);
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
