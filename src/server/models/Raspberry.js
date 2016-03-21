import {Raspberry as raspberryModel} from "./mongoose/mongoose-models";
var Promise = require("bluebird");

/* istanbul ignore next */
var Raspberry = function () {};

Raspberry.modulesListeners = {};

Raspberry.add = function (name, modulesNames = []) {
    return new Promise(function (resolve, reject) {
        console.log("new Raspberry: " + name);
        raspberryModel.findOne({name: name}, function (err, rasp) {
            /* istanbul ignore next */
            if (err) {
                return reject(err);
            }
            if (rasp) {
                return reject({code: 10, message: "Name already taken",
                  id: "RASPBERRY_NAME_EXISTS"});
            }
            var newRasp = new raspberryModel();
            newRasp.name = name;
            newRasp.modules = [];
            for (var i = 0; i < modulesNames.length; i++) {
                newRasp.modules.push({
                    name: modulesNames[i],
                    state: "DOWN"
                });
            }
            return newRasp.save(function (errSaving, saved) {
                /* istanbul ignore next */
                if (errSaving) {
                    return reject({
                        code: 0,
                        message: "mongo error",
                        id: "MONGO_ERROR",
                        details: errSaving
                    });
                }
                return resolve(saved);
            });
        });
    });
};

Raspberry.emitTo = function (name, event, data) {
    return new Promise(function (resolve, reject) {
        Raspberry.findOne(name)
        .then(function (raspberry) {
            if (!raspberry) {
                return reject({
                    code: 404,
                    message: "no raspberry with that name",
                    id: "RASPBERRY_NOT_FOUND"
                });
            }
            if (process.messager) {
                process.messager(undefined, event, data);
            }
            resolve();
        }).catch(reject);
    });
};

Raspberry.findOne = function (name) {
    return new Promise(function (resolve, reject) {
        raspberryModel.findOne({name: name}, function (err, raspberry) {
            /* istanbul ignore next */
            if (err) {
                return reject({code: 0, message: "mongo error", id: "MONGO_ERROR", details: err});
            } else if (!raspberry) {
                return reject({
                    code: 404,
                    message: "no raspberry with that name",
                    id: "RASPBERRY_NOT_FOUND"
                });
            }
            return resolve(raspberry);
        });
    });
};

Raspberry.start = function (name, ip, socketId) {
    return new Promise(function (resolve, reject) {
        raspberryModel.findOneAndUpdate({ name: name },
          { ip: ip, socketId: socketId, state: "UP" },
          { multi: false, "new": true}, // eslint-disable-line
          function (err, raspberry) {
              if (err) {
                  return reject({code: 0, message: "mongo error", id: "MONGO_ERROR", details: err});
              } else if (!raspberry) {
                  return reject({
                      code: 404,
                      message: "no raspberry with that name",
                      id: "RASPBERRY_NOT_FOUND"
                  });
              }
              return resolve(raspberry);
          });
    });
};
function doStop(raspberry) {
    return new Promise((resolve, reject) => {
        raspberry.ip = null;
        raspberry.socketId = null;
        for (var i = 0; i < raspberry.modules.length; i++) {
            raspberry.modules[i].state = "DOWN";
            Raspberry._notifyModuleChange(raspberry, raspberry.modules[i]);
        }
        raspberry.state = "DOWN";
        raspberry.save(function (err) {
            /* istanbul ignore next */
            if (err) {
                return reject({code: 0, message: "mongo error", id: "MONGO_ERROR", details: err});
            }
            return resolve(raspberry);
        });
    });
}

Raspberry.stop = function (name) {
    return new Promise(function (resolve, reject) {
        Raspberry.findOne(name)
        .then(function (raspberry) {
            doStop(raspberry).then(resolve).catch(reject);
        }).catch(reject);
    });
};
Raspberry.stopAll = function () {
    return new Promise(function (resolve, reject) {
        console.log("will stop");
        raspberryModel.find({}, function (err, raspberries) {
            /* istanbul ignore next */
            if (err) {
                return reject(err);
            }
            var promises = [];
            for (var i = 0; i < raspberries.length; i++) {
                promises.push(doStop(raspberries[i]));
            }
            return Promise.all(promises)
              .then(function (data) {
                  resolve(data);
              }).catch(reject);
        });
    });
};

Raspberry.getAll = function () {
    return new Promise(function (resolve, reject) {
        raspberryModel.find(function (err, raspberries) {
            if (err) {
                return reject({code: 0, message: "mongo error", id: "MONGO_ERROR", details: err});
            } else {
                return resolve(raspberries);
            }
        });
    });
}

Raspberry.moduleStarted = function (raspberryName, moduleInfo) {
    return new Promise(function (resolve, reject) {
        console.log("module started");
        console.log(JSON.stringify(moduleInfo, null, 2));
        Raspberry.findOne(raspberryName)
        .then(function (raspberry) {
            console.log("got raspberry", raspberry);
            for (var i = 0; i < raspberry.modules.length; i++) {
                if (moduleInfo.name === raspberry.modules[i].name) {
                    console.log("found module");
                    raspberry.modules[i].state = "UP";
                    Raspberry._notifyModuleChange(raspberry, raspberry.modules[i], moduleInfo);
                    break;
                }
            }
            raspberry.save(function (err) {
                /* istanbul ignore next */
                if (err) {
                    return reject({
                        code: 0,
                        message: "mongo error",
                        id: "MONGO_ERROR", details: err
                    });
                } else {
                    return resolve(raspberry);
                }
            })
        }).catch(reject);
    });

}

Raspberry.onModuleChange = function (moduleName, callback) {
    if (typeof callback !== "function") {
        console.log("In Raspberry.onModuleChange: not a function");
        throw new Error("callback should be a function");
    }
    if (!Raspberry.modulesListeners[moduleName]) {
        Raspberry.modulesListeners[moduleName] = [];
    }
    Raspberry.modulesListeners[moduleName].push(callback);
    console.log("new callback added for " + moduleName);
    return 1;
};
Raspberry._notifyModuleChange = function (raspberry, module, moduleInfo) {
    if (!Raspberry.modulesListeners[module.name]) return;
    for (var i = 0; i < Raspberry.modulesListeners[module.name].length; i++) {
        console.log("notify one...");
        Raspberry.modulesListeners[module.name][i](raspberry, module, moduleInfo);
    }
};

Raspberry.status = {
    PLAYING: "PLAYING",
    PAUSED: "PAUSED"
};

export default Raspberry;
