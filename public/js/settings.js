let clientManager = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION);
/**
 * @type {PluginController}
 */
let pluginController = clientManager.init().getPluginController();

t.render(function () {

    return pluginController.getPluginConfiguration()
        .then(function (data) {
            let moduleSettingsController = ModuleSettingsController.create(t, pluginController, t.arg("module"), t.arg("editable"), document, clientManager, DI.getInstance().getAdminService(t));

            return moduleSettingsController.render.call(moduleSettingsController, data)
                .then(function() {
                    return t.sizeTo("#content").done();
                });
        });
});