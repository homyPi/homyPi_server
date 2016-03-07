function superUsefull() {
    return "There's always time for a nice cup of tea";
}

module.exports = {
    config: require("./config"),
    link: require("./link"),
    shared: {
        superUsefull
    }
};
