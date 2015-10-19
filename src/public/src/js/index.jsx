import React from 'react';
import AppContainer from './components/AppContainer.jsx';
import ModuleManager from './ModuleManager.jsx';

window.homy_config = require("./config");
console.log("conf = ", window.homy_config)
ModuleManager.loadModules();
React.render(<AppContainer />, document.getElementById('main'));
