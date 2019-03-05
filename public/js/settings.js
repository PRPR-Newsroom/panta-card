/**
 * @type {PluginController}
 */
let pluginController = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getPluginController();

t.render(function () {

    return pluginController.getPluginConfiguration()
        .then(function (data) {
            let moduleSettingsController = ModuleSettingsController.create(t, pluginController, t.arg("module"), t.arg("editable"), document);
            moduleSettingsController.render.call(moduleSettingsController, data);

            return t.sizeTo("#content").done();
        });
});