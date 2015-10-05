import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import Io from "../io.jsx";


export default React.createClass({
  
  render() {
    return (
      <div>
        <h1>HomyPy - Home</h1>
        <Link to="/login">Login</Link>
      </div>
    );
  }
});
