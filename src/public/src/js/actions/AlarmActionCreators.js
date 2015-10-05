import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import AlarmAPI from '../apis/AlarmAPI.jsx';

export default {
  loadAlarms() {
    AlarmAPI.getAlarms().then(function(alarms){
      Dispatcher.handleViewAction({
        type: Constants.ActionTypes.SET_ALARMS,
        alarms: alarms
      });
    }).catch(function(err) {
      
    });
  },
  deleteAlarm(alarm) {
    AlarmAPI.deleteAlarm(alarm).then(function(alarm) {
Dispatcher.handleViewAction({
        type: Constants.ActionTypes.DELETE_ALARM,
        alarm: alarm
      });
    }).catch(function(err) {
      
    })
  },
  addAlarm(alarm) {
    Dispatcher.handleViewAction({
        type: Constants.ActionTypes.ADD_ALARM,
        alarm: alarm
      });
  },
  editAlarm(alarm) {
    let apiFunction;
    alarm.hours = alarm.date.getHours();
    alarm.minutes = alarm.date.getMinutes();
    if(!alarm._id) {
      apiFunction = AlarmAPI.insertAlarm;
    } else {
      apiFunction = AlarmAPI.updateAlarm;
    }
    apiFunction(alarm).then(function() {
      Dispatcher.handleViewAction({
        type: Constants.ActionTypes.UPDATE_ALARM,
        alarm: alarm
      });
    }).catch(function(err) {
      
    });
  },
  enableAlarm(alarm, enabled) {
    AlarmAPI.enableAlarm(alarm, enabled).then(function() {
      Dispatcher.handleViewAction({
        type: Constants.ActionTypes.UPDATE_ALARM,
        alarm: alarm
      });
    }).catch(function(err) {
      
    });
  }
};
