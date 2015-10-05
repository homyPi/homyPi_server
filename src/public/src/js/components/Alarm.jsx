import React from 'react';
import ActionCreator from '../actions/AlarmActionCreators';
import {Checkbox, FontIcon, RaisedButton, TimePicker, FlatButton} from 'material-ui';

export default React.createClass({
  getInitialState: function() {
      return {
          showBody: false
      };
  },
  toogleBody() {
    this.setState({showBody: !this.state.showBody});
  },
  editAlarm(event, newDate) {
    let alarm = this.props.alarm;
    alarm.date = newDate;
    alarm.hours = newDate.getHours();
    alarm.minutes = newDate.getMinutes();
    this.props.editAlarm(alarm)
  },
  change() {
    
  },
  componentDidMount() {
    if (!this.props.alarm._id) {
      this.refs.timePicker._handleInputTouchTap(new Event('build'));
    }
  },
  render() {
    let {alarm, enable} = this.props;//
    
    return (
      <div className={alarm.enable ? "alarm enabled": "alarm disabled"}>
        <div className="alarm-header">
          <Checkbox className="alarm-enable-checkbox"
            name="checkboxEnabled"
            defaultChecked={alarm.enable}
            label=""
            onCheck={enable.bind(null, alarm)}/>
          <div className="alarm-time">
            <TimePicker
              ref="timePicker"
              format="24hr"
              defaultTime={alarm.date}
              onChange={this.editAlarm}
              hintText="24hr Format" />
          </div>
          <div className="alarm-show-body" onClick={this.toogleBody}>
            <i className="material-icons">{this.state.showBody? "keyboard_arrow_up":"keyboard_arrow_down"}</i>
          </div>
        </div>
        <div className={this.state.showBody ? "alarm-body visible":"alarm-body hidden"}>
          <div className="alarm-history">
            <h3>History</h3>
          </div>
          <RaisedButton secondary={true} label="Delete" onClick={this.props.onDelete.bind(null, alarm)}/>
        </div>
      </div>
    );
  }
});
