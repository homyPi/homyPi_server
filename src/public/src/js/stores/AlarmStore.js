import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

// data storage
let _data = [];

// add private functions to modify data
function addItem(_id, hours, minutes, enable=true, repeat=false) {
  let date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  _data.push({_id, hours, minutes, date, enable, repeat});
}
function setList(alarms) {
  _data = []
  alarms.forEach(function(alarm) {
      addItem(alarm._id, alarm.hours, alarm.minutes, alarm.enable);
  });
}
function deleteAlarm(alarm) {
  let i = 0;
  _data.forEach(function(a) {
    if (a._id === alarm._id) {
      _data.splice(i,1);
      return false;
    }
    i++;
  })
}

function compare(a, b) {
  if (a.hours > b.hours) {
    return 1;
  } else if (a.hours < b.hours) {
    return -1;
  } else {
    if (a.minutes > b.minutes) {
      return 1;
    } else if (a.minutes < b.minutes) {
      return -1;
    }
  }
  // a must be equal to b
  return 0;
}

// Facebook style store creation.
const AlarmStore = assign({}, BaseStore, {
  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      alarms: _data
    };
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    switch(action.type) {
      case Constants.ActionTypes.ALARM_ADDED:
        let alarm = action.alarm;
        addItem(null,alarm.hours, alarm.minutes, alarm.enable);
        _data.sort(compare);
        AlarmStore.emitChange();
        break;
      case Constants.ActionTypes.SET_ALARMS:
        let alarms = action.alarms;
        setList(alarms);
        _data.sort(compare);
        AlarmStore.emitChange();
        break;
      case Constants.ActionTypes.DELETE_ALARM:
        let deletedAlarm = action.alarm;
        deleteAlarm(deletedAlarm);
        _data.sort(compare);
        AlarmStore.emitChange();
        break;
      case Constants.ActionTypes.ADD_ALARM:
        let newAlarm = action.alarm;
        addItem(null, newAlarm.hours, newAlarm.minutes);
        _data.sort(compare);
        AlarmStore.emitChange();
        break;
      case Constants.ActionTypes.UPDATE_ALARM:
        _data.sort(compare);
        AlarmStore.emitChange();
        break;
      default:
        break;

      // add more cases for other actionTypes...
    }
  })
});

export default AlarmStore;
