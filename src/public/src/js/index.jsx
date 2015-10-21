import React from 'react';
import AppContainer from './components/AppContainer.jsx';
import ModuleManager from './ModuleManager.jsx';
import ReactDOM from "react-dom";

window.homy_config = require("./config");
console.log("conf = ", window.homy_config)
ModuleManager.loadModules();
ReactDOM.render(<AppContainer />, document.getElementById('main'));
