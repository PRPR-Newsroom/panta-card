    /**
 * @type {PluginController}
 */
let pluginController = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getPluginController();

t.render(function () {

    return pluginController.getPluginConfiguration()
        .then(function (config) {
            if (config instanceof PluginConfiguration) {
                document.getElementsByClassName("plugin-version").forEach(function (element) {
                    element.innerHTML = config.version;
                });

                document.getElementsByClassName("plugin-description").forEach(function (element) {
                    element.innerHTML = config.description;
                });

                document.getElementsByClassName("plugin-modules").forEach(function (element) {
                    let list = Object.values(config.modules).map(function(module) {
                        let item = document.createElement("li");
                        item.setAttribute("id", module.id);
                        item.innerText = module.name;
                        return item;
                    }).reduce(function(prev, curr) {
                        prev.appendChild(curr);
                        return prev;
                    }, document.createElement("ul"));
                    element.appendChild(list);
                });

            } else {
                document.getElementsByClassName("plugin-version").forEach(function (element) {
                    element.innerText = "<unknown_version>";
                });

                document.getElementsByClassName("plugin-description").forEach(function (element) {
                    element.innerText = "<not_set>";
                });
            }
            return t.sizeTo("#content").done();
        });
});