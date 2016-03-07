var Shared;

module.exports = {
    load: function (AppShared) {
        "use strict";
        Shared = AppShared;
    },
    getShared: function () {
        return Shared;
    }
};
