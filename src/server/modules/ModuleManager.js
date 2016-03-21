var _ = require("lodash");
var Promise = require("bluebird");
var Toposort = require("toposort-class"),
    t = new Toposort();
var ServicesManager = require("./ServicesManager");
var config = require("../data/private/config");


var ModuleManager = function () {};

ModuleManager.Shared = {
    config: config,
    modules: {}
};
ModuleManager.UserMiddleware = null;
ModuleManager.MongooseModels = null;

ModuleManager.modulesNames = [];
ModuleManager.modules = {};
ModuleManager.order = [];

ModuleManager.init = function (modules) {
    ModuleManager.modulesNames = [];
    if (!modules) {
        modules = require("../data/public/config").modules;
    }
    ModuleManager.modules = modules;
    for (var m in modules) { // eslint-disable-line guard-for-in
        ModuleManager.modulesNames.push(m);
        ModuleManager.modules[m].directory = ModuleManager.modules[m].directory || m;
    }
    ModuleManager._setOrder();
};
ModuleManager.get = function (moduleName) {
    if (ModuleManager.modules[moduleName] && ModuleManager.modules[moduleName].module) {
        return ModuleManager.modules[moduleName].module;
    }
    var err = new Error("Cannot find module '" + moduleName + "'");
    err.code = "MODULE_NOT_FOUND";
    throw err;
};
ModuleManager._setOrder = function () {
    _.forEach(ModuleManager.modulesNames, function (m) {
        var mGraph = [];
        console.log(ModuleManager.modules[m]);
        if (!ModuleManager.modules[m] || !ModuleManager.modules[m].loaded) {
            if (!ModuleManager.modules[m]) ModuleManager.modules[m] = {};
            var moduleConfig = require(ModuleManager.modules[m].directory + "/server/config");
            ModuleManager.modules[m] = Object.assign(ModuleManager.modules[m], moduleConfig);
            ModuleManager.modules[m].loaded = true;
        }
        if (ModuleManager.modules[m].require) {
            ModuleManager.modules[m].require.every(function (dep) {
                mGraph.push(dep.module);
            });
        }
        t.add(m, mGraph);
    });
    ModuleManager.order = t.sort().reverse();
};
ModuleManager._setModule = function (module, moduleName) {
    return new Promise(function (resolve, reject) {
        if (!module) {
            return reject("unknown module " + moduleName);
        }
        if (module.error) {
            return reject(module.error);
        }

        try {
            console.log("Setting up " + moduleName);
            // checkConfig(module, moduleName);
            if (!module.module) {
                module.module = require(ModuleManager.modules[moduleName].directory + "/server");
            }
            if (module.module.shared) {
                ModuleManager.Shared.modules[moduleName] = module.module.shared;
            }
            if (typeof module.module.link.load === "function") {
                module.module.link.load(ModuleManager.Shared, config);
            }
            console.log(moduleName + " LOADED");

            if (typeof module.getServices === "function") {
                ServicesManager.addServices(module.getServices());
            }

            if (typeof module.module.init === "function") {
                console.log("init " + JSON.stringify(module.module));
                return module.module.init().then(resolve).catch(reject);
            }
            return resolve();
        } catch (e) {
            console.log(e);
            console.log(e.stack);
            module = {error: e};
            return reject();
        }
    });
};
ModuleManager.executePromiseSorted = function (fn, i) {
    return new Promise(function (resolve, reject) {
        if (!ModuleManager.order.length || typeof fn !== "function") return resolve();

        if (typeof i === "undefined") {
            i = 0;
        }
        var modName = ModuleManager.order[i];
        console.log("execute promise for " + modName + "(" + i + ")");
        return fn(ModuleManager.modules[modName], modName)
            .then(function () {
                i++;
                if (i < ModuleManager.order.length) {
                    ModuleManager.executePromiseSorted(fn, i)
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve();
                }
            }).catch(reject);
    });
};

ModuleManager.executeSorted = function (fn) {
    if (typeof fn !== "function") return;
    for (var i = 0; i < ModuleManager.order.length; i++) {
        console.log(ModuleManager.order[i]);
        if (ModuleManager.modules[ModuleManager.order[i]]) {
            fn(ModuleManager.modules[ModuleManager.order[i]], ModuleManager.order[i]);
        }
    }
};
ModuleManager.load = function (messager) {
    return new Promise(function (resolve, reject) {
        console.log("Loading modules");
        ModuleManager.Shared.messager = messager;
        ModuleManager.Shared.Raspberry = require("../models/Raspberry").default;
        ModuleManager.Shared.User = require("../middleware/user");
        ModuleManager.Shared.MongooseModels = require("../models/mongoose/mongoose-models");
        ModuleManager.executePromiseSorted(ModuleManager._setModule)
            .then(resolve)
            .catch(reject);
    });
    // executeSorted(setModule);
};
ModuleManager.getAll = function () {
    return ModuleManager.modules;
};

module.exports = ModuleManager;
