import React, {PropTypes} from 'react';
import AlarmList from './AlarmList.jsx';
import Io from "../io.jsx";

export default React.createClass({
  propTypes: {},

  render() {
    return (
      <div>
        <AlarmList/>
      </div>
    );
  }
});
